---
title: ASP.NET Core Web API — Backend Architecture
version: 1.2.0
last_updated: 2026-05-13
changelog:
  - version: 1.2.0
    date: 2026-05-13
    changes:
      - Replace symmetric JWT secret with OIDC discovery + JWKS (RS256 public key verification)
      - Add step-by-step cryptographic verification flow documentation
      - Remove JwtSecret from all config templates and environment variables
      - Add OIDC/JWKS vs symmetric comparison table
  - version: 1.1.0
    date: 2026-05-13
    changes:
      - Switch database to Supabase PostgreSQL (hosted)
      - Replace ASP.NET Core Identity with Supabase Auth (JWT validation)
      - Add Google and Facebook OAuth via Supabase
      - Remove caching layer (deferred to future phase)
      - Update deployment to use Supabase hosted services
      - Add Supabase Storage for product images
  - version: 1.0.0
    date: 2026-05-13
    changes:
      - Initial architecture document
      - Domain models, API design, database schema, project structure
---

# ASP.NET Core Web API — Backend Architecture for Nhãn Việt

> Companion to the frontend codebase (`nextjs-web-ban-hang`). This document describes how to build the backend API server in **.NET 8** using **ASP.NET Core Web API** with **Clean Architecture**, targeting the Vietnamese longan e-commerce site **Nhãn Việt**.

---

## Table of Contents

1. [Goals & Scope](#1-goals--scope)
2. [Technology Stack](#2-technology-stack)
3. [Solution Structure](#3-solution-structure)
4. [Domain Layer](#4-domain-layer)
5. [Application Layer](#5-application-layer)
6. [Infrastructure Layer](#6-infrastructure-layer)
7. [API Layer (Presentation)](#7-api-layer-presentation)
8. [Database Schema](#8-database-schema)
9. [API Endpoints](#9-api-endpoints)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Business Rules](#11-business-rules)
12. [Error Handling](#12-error-handling)
13. [CORS & Frontend Integration](#13-cors--frontend-integration)
14. [Logging & Observability](#14-logging--observability)
15. [Testing Strategy](#15-testing-strategy)
16. [Deployment](#16-deployment)
17. [Phase Roadmap](#17-phase-roadmap)

---

## 1. Goals & Scope

### What this backend replaces

The frontend currently uses:
- **Hardcoded product arrays** in `src/lib/data/products.ts` (12 products)
- **localStorage** for cart persistence (`CartProvider.tsx`)
- **Mock auth** in `LoginModal.tsx` (no real validation)
- **Mock orders** in `OrdersPage.tsx` (3 hardcoded orders)
- **No-op contact form** in `ContactPage.tsx` (logs to console)
- **Client-side shipping calculation** in `CartModal.tsx` (free over 499,000 VND, else 30,000 VND)

### What this backend provides

| Capability | Description |
|---|---|
| Product catalog | CRUD for products with variants, categories, images (Supabase PostgreSQL + EF Core) |
| Cart (server-side) | Authenticated cart stored in DB, guest cart via session cookie |
| Orders | Create, read, update status, cancel |
| Authentication | Supabase Auth — email/password + Google + Facebook OAuth. .NET validates Supabase JWTs. |
| User profiles | Application-specific profile data (name, phone, address) in `app_users` table |
| Contact | Accept contact form submissions, store & notify |
| Shipping | Calculate shipping fees server-side |
| Admin | Product/order/customer management APIs, role assignment via Supabase Admin API |
| Image uploads | Product images to Supabase Storage buckets |

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Runtime** | .NET 8 LTS | Long-term support, performance, cross-platform |
| **Framework** | ASP.NET Core Web API (Minimal APIs or Controllers) | Native REST support, dependency injection |
| **ORM** | Entity Framework Core 8 | Migrations, LINQ, strong .NET ecosystem |
| **Database** | Supabase PostgreSQL (hosted) | Managed PostgreSQL, built-in auth, storage, realtime — connected via standard Npgsql/EF Core |
| **Auth** | Supabase Auth (JWT/RS256) — validated server-side via JWKS | Supabase handles registration, login, OAuth (Google, Facebook), token issuance. ASP.NET Core fetches Supabase's RSA public key via OIDC discovery (JWKS) and cryptographically verifies token signatures. No ASP.NET Core Identity needed. |
| **OAuth Providers** | Google, Facebook (configured in Supabase dashboard) | Social login via Supabase's built-in OAuth flow — zero provider code in .NET |
| **Validation** | FluentValidation | Expressive, testable validation rules |
| **Mapping** | Mapster or manual mapping | Lightweight, AOT-friendly |
| **Logging** | Serilog + Seq (or Application Insights) | Structured logging |
| **Caching** | _Deferred_ — direct DB queries for now | Will add IMemoryCache / Redis in a future phase |
| **File Storage** | Supabase Storage | Product images stored in Supabase buckets, served via Supabase CDN URLs |
| **Email** | SMTP / SendGrid / Resend | Contact form notifications, order confirmations |
| **API Docs** | Swagger/OpenAPI via Swashbuckle | Interactive API documentation |
| **Testing** | xUnit + FluentAssertions + Moq/NSubstitute | Unit + integration tests |
| **Containerization** | Docker + docker-compose | Consistent dev/prod environments |

### Why Supabase?

Supabase provides a **managed PostgreSQL** instance plus auth, storage, and edge functions out of the box. The ASP.NET Core API connects to the same PostgreSQL via a standard connection string — EF Core doesn't know or care that it's Supabase under the hood. The auth layer is where it matters most: Supabase handles user registration, password hashing, OAuth flows (Google, Facebook), email verification, and JWT issuance (RS256-signed). The .NET API only needs to **cryptographically verify the JWT signature** using Supabase's RSA public key (fetched automatically via OIDC discovery / JWKS) — no Identity tables, no password storage, no OAuth callback handling, no shared secrets in .NET.

### What Supabase manages vs. what .NET manages

| Concern | Managed by |
|---|---|
| PostgreSQL hosting, backups, connection pooling (Supavisor) | Supabase |
| User registration, login, password reset | Supabase Auth |
| Google / Facebook OAuth flows | Supabase Auth |
| JWT issuance + refresh tokens | Supabase Auth |
| File/image storage + CDN | Supabase Storage |
| JWT validation on API requests (RSA signature via JWKS) | ASP.NET Core (`AddJwtBearer` + OIDC discovery) |
| Business tables (products, orders, carts) | EF Core migrations against Supabase PostgreSQL |
| Business logic, domain rules | .NET (Clean Architecture) |
| Admin role assignment | .NET (custom `app_metadata` claim or `user_roles` table) |

---

## 3. Solution Structure

```
NhanViet/
├── NhanViet.sln
│
├── src/
│   ├── NhanViet.Domain/                    # Entities, Value Objects, Domain Events
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   ├── Enums/
│   │   ├── Events/
│   │   ├── Exceptions/
│   │   └── Interfaces/                     # Repository interfaces (domain ports)
│   │
│   ├── NhanViet.Application/               # Use Cases, DTOs, Validators
│   │   ├── Common/
│   │   │   ├── Interfaces/                 # IUnitOfWork, IEmailSender, IFileStorage
│   │   │   ├── Behaviors/                  # MediatR pipeline behaviors
│   │   │   ├── Exceptions/
│   │   │   └── Models/                     # PagedResult<T>, Result<T>
│   │   ├── Products/
│   │   │   ├── Commands/
│   │   │   ├── Queries/
│   │   │   └── DTOs/
│   │   ├── Cart/
│   │   │   ├── Commands/
│   │   │   ├── Queries/
│   │   │   └── DTOs/
│   │   ├── Orders/
│   │   │   ├── Commands/
│   │   │   ├── Queries/
│   │   │   └── DTOs/
│   │   ├── Auth/
│   │   │   ├── Commands/
│   │   │   ├── Queries/
│   │   │   └── DTOs/
│   │   └── Contact/
│   │       ├── Commands/
│   │       └── DTOs/
│   │
│   ├── NhanViet.Infrastructure/            # EF Core, Email, File Storage, External Services
│   │   ├── Data/
│   │   │   ├── NhanVietDbContext.cs
│   │   │   ├── Configurations/             # EF Fluent API configs
│   │   │   ├── Migrations/
│   │   │   └── Seed/                       # Initial product data seeder
│   │   ├── Repositories/
│   │   ├── Services/
│   │   │   ├── EmailService.cs
│   │   │   ├── SupabaseStorageService.cs
│   │   │   └── SupabaseAdminService.cs
│   │   └── DependencyInjection.cs          # IServiceCollection extensions
│   │
│   └── NhanViet.Api/                       # ASP.NET Core Web API host
│       ├── Controllers/
│       │   ├── ProductsController.cs
│       │   ├── CartController.cs
│       │   ├── OrdersController.cs
│       │   ├── AuthController.cs
│       │   ├── ContactController.cs
│       │   └── AdminController.cs
│       ├── Middleware/
│       │   ├── ExceptionHandlingMiddleware.cs
│       │   └── RequestLoggingMiddleware.cs
│       ├── Filters/
│       ├── Extensions/
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── Program.cs
│       └── Dockerfile
│
├── tests/
│   ├── NhanViet.Domain.Tests/
│   ├── NhanViet.Application.Tests/
│   ├── NhanViet.Infrastructure.Tests/
│   └── NhanViet.Api.IntegrationTests/
│
├── docker-compose.yml
├── docker-compose.override.yml
└── .github/
    └── workflows/
        └── ci.yml
```

### Dependency flow (Clean Architecture)

```
Api → Application → Domain
         ↑
Infrastructure (implements Application interfaces)
```

- **Domain** depends on nothing (pure C#, no NuGet packages except maybe `MediatR.Contracts`)
- **Application** depends on Domain
- **Infrastructure** depends on Application + Domain (implements interfaces)
- **Api** depends on all layers (composition root)

---

## 4. Domain Layer

### 4.1 Entities

```csharp
// NhanViet.Domain/Entities/Product.cs
public class Product
{
    public Guid Id { get; private set; }
    public string Slug { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string? FullDescription { get; private set; }
    public ProductCategory Category { get; private set; }
    public string Unit { get; private set; } = string.Empty;
    public string Image { get; private set; } = string.Empty;      // primary image URL
    public List<string> Images { get; private set; } = [];          // gallery URLs
    public decimal Rating { get; private set; }
    public string? Badge { get; private set; }
    public bool Featured { get; private set; }
    public string? Origin { get; private set; }
    public string? Harvest { get; private set; }
    public string? Packaging { get; private set; }
    public string? Storage { get; private set; }
    public string? Shipping { get; private set; }
    public bool IsActive { get; private set; } = true;
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Navigation
    public IReadOnlyCollection<ProductVariant> Variants => _variants.AsReadOnly();
    private readonly List<ProductVariant> _variants = [];

    // Domain method: compute the display price (min variant price)
    public decimal Price => _variants.Count > 0
        ? _variants.Min(v => v.Price)
        : 0;

    public decimal? OldPrice => _variants
        .Where(v => v.OldPrice.HasValue)
        .Select(v => v.OldPrice)
        .FirstOrDefault();
}
```

```csharp
// NhanViet.Domain/Entities/ProductVariant.cs
public class ProductVariant
{
    public Guid Id { get; private set; }
    public Guid ProductId { get; private set; }
    public string Name { get; private set; } = string.Empty;       // e.g. "1kg", "2kg", "Combo cơ bản"
    public decimal Price { get; private set; }                      // VND, integer dong stored as decimal
    public decimal? OldPrice { get; private set; }
    public int Stock { get; private set; }
    public bool IsActive { get; private set; } = true;

    // Navigation
    public Product Product { get; private set; } = null!;

    // Domain methods
    public bool IsOnSale => OldPrice.HasValue && OldPrice.Value > Price;
    public int DiscountPercent => IsOnSale
        ? (int)Math.Round((OldPrice!.Value - Price) / OldPrice.Value * 100)
        : 0;
    public bool InStock => Stock > 0;

    public void DeductStock(int quantity)
    {
        if (quantity > Stock)
            throw new InsufficientStockException(ProductId, Id, Stock, quantity);
        Stock -= quantity;
    }

    public void RestoreStock(int quantity)
    {
        Stock += quantity;
    }
}
```

```csharp
// NhanViet.Domain/Entities/Cart.cs
public class Cart
{
    public Guid Id { get; private set; }
    public Guid? UserId { get; private set; }              // null for guest carts
    public string? SessionId { get; private set; }         // for guest identification
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public IReadOnlyCollection<CartItem> Items => _items.AsReadOnly();
    private readonly List<CartItem> _items = [];

    public decimal Subtotal => _items.Sum(i => i.LineTotal);
    public int TotalCount => _items.Sum(i => i.Quantity);

    public void AddItem(Product product, ProductVariant variant, int quantity)
    {
        if (quantity < 1)
            throw new ArgumentException("Quantity must be >= 1");
        if (variant.Stock < quantity)
            throw new InsufficientStockException(product.Id, variant.Id, variant.Stock, quantity);

        var existing = _items.FirstOrDefault(i =>
            i.ProductId == product.Id && i.VariantId == variant.Id);

        if (existing is not null)
        {
            existing.UpdateQuantity(existing.Quantity + quantity, variant.Stock);
        }
        else
        {
            _items.Add(CartItem.Create(product, variant, quantity));
        }

        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveItem(Guid productId, Guid variantId)
    {
        var item = _items.FirstOrDefault(i =>
            i.ProductId == productId && i.VariantId == variantId);
        if (item is not null)
        {
            _items.Remove(item);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void UpdateItemQuantity(Guid productId, Guid variantId, int quantity, int maxStock)
    {
        var item = _items.FirstOrDefault(i =>
            i.ProductId == productId && i.VariantId == variantId)
            ?? throw new CartItemNotFoundException(productId, variantId);

        item.UpdateQuantity(quantity, maxStock);
        UpdatedAt = DateTime.UtcNow;
    }

    public void Clear()
    {
        _items.Clear();
        UpdatedAt = DateTime.UtcNow;
    }

    public void MergeFrom(Cart guest)
    {
        foreach (var item in guest.Items)
        {
            var existing = _items.FirstOrDefault(i =>
                i.ProductId == item.ProductId && i.VariantId == item.VariantId);
            if (existing is not null)
                existing.UpdateQuantity(existing.Quantity + item.Quantity, int.MaxValue);
            else
                _items.Add(item);
        }
        UpdatedAt = DateTime.UtcNow;
    }
}
```

```csharp
// NhanViet.Domain/Entities/CartItem.cs
public class CartItem
{
    public Guid Id { get; private set; }
    public Guid CartId { get; private set; }
    public Guid ProductId { get; private set; }
    public Guid VariantId { get; private set; }
    public string ProductName { get; private set; } = string.Empty;
    public string VariantName { get; private set; } = string.Empty;
    public string ProductImage { get; private set; } = string.Empty;
    public string Unit { get; private set; } = string.Empty;
    public decimal UnitPrice { get; private set; }
    public int Quantity { get; private set; }

    public decimal LineTotal => UnitPrice * Quantity;

    public static CartItem Create(Product product, ProductVariant variant, int quantity) => new()
    {
        Id = Guid.NewGuid(),
        ProductId = product.Id,
        VariantId = variant.Id,
        ProductName = product.Name,
        VariantName = variant.Name,
        ProductImage = product.Image,
        Unit = product.Unit,
        UnitPrice = variant.Price,
        Quantity = quantity,
    };

    public void UpdateQuantity(int quantity, int maxStock)
    {
        if (quantity < 1)
            throw new ArgumentException("Quantity must be >= 1");
        Quantity = Math.Min(quantity, maxStock);
    }
}
```

```csharp
// NhanViet.Domain/Entities/Order.cs
public class Order
{
    public Guid Id { get; private set; }
    public string OrderCode { get; private set; } = string.Empty;   // human-readable: "DH001"
    public Guid? UserId { get; private set; }
    public OrderStatus Status { get; private set; }
    public decimal Subtotal { get; private set; }
    public decimal ShippingFee { get; private set; }
    public decimal Total { get; private set; }
    public PaymentMethod PaymentMethod { get; private set; }
    public string? Note { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Shipping address (value object embedded)
    public string CustomerName { get; private set; } = string.Empty;
    public string CustomerPhone { get; private set; } = string.Empty;
    public string? CustomerEmail { get; private set; }
    public string ShippingAddress { get; private set; } = string.Empty;

    // Navigation
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();
    private readonly List<OrderItem> _items = [];
    public IReadOnlyCollection<OrderStatusHistory> StatusHistory => _statusHistory.AsReadOnly();
    private readonly List<OrderStatusHistory> _statusHistory = [];

    public static Order CreateFromCart(
        Cart cart,
        string customerName,
        string customerPhone,
        string? customerEmail,
        string shippingAddress,
        PaymentMethod paymentMethod,
        string? note,
        decimal shippingFee)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            OrderCode = GenerateOrderCode(),
            UserId = cart.UserId,
            Status = OrderStatus.Pending,
            Subtotal = cart.Subtotal,
            ShippingFee = shippingFee,
            Total = cart.Subtotal + shippingFee,
            PaymentMethod = paymentMethod,
            Note = note,
            CustomerName = customerName,
            CustomerPhone = customerPhone,
            CustomerEmail = customerEmail,
            ShippingAddress = shippingAddress,
            CreatedAt = DateTime.UtcNow,
        };

        foreach (var cartItem in cart.Items)
        {
            order._items.Add(OrderItem.FromCartItem(cartItem));
        }

        order._statusHistory.Add(new OrderStatusHistory
        {
            Status = OrderStatus.Pending,
            Timestamp = DateTime.UtcNow,
        });

        return order;
    }

    public void Confirm()
    {
        if (Status != OrderStatus.Pending)
            throw new InvalidOrderStateException(Id, Status, OrderStatus.Confirmed);
        TransitionTo(OrderStatus.Confirmed);
    }

    public void Ship()
    {
        if (Status != OrderStatus.Confirmed)
            throw new InvalidOrderStateException(Id, Status, OrderStatus.Shipping);
        TransitionTo(OrderStatus.Shipping);
    }

    public void Complete()
    {
        if (Status != OrderStatus.Shipping)
            throw new InvalidOrderStateException(Id, Status, OrderStatus.Completed);
        TransitionTo(OrderStatus.Completed);
    }

    public void Cancel(string? reason = null)
    {
        if (Status is OrderStatus.Completed or OrderStatus.Cancelled)
            throw new InvalidOrderStateException(Id, Status, OrderStatus.Cancelled);
        TransitionTo(OrderStatus.Cancelled, reason);
    }

    private void TransitionTo(OrderStatus newStatus, string? reason = null)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
        _statusHistory.Add(new OrderStatusHistory
        {
            Status = newStatus,
            Timestamp = DateTime.UtcNow,
            Reason = reason,
        });
    }

    private static string GenerateOrderCode()
    {
        var timestamp = DateTime.UtcNow.ToString("yyMMdd");
        var random = Random.Shared.Next(1000, 9999);
        return $"DH{timestamp}{random}";
    }
}
```

```csharp
// NhanViet.Domain/Entities/OrderItem.cs
public class OrderItem
{
    public Guid Id { get; private set; }
    public Guid OrderId { get; private set; }
    public Guid ProductId { get; private set; }
    public Guid VariantId { get; private set; }
    public string ProductName { get; private set; } = string.Empty;
    public string VariantName { get; private set; } = string.Empty;
    public decimal UnitPrice { get; private set; }
    public int Quantity { get; private set; }
    public decimal LineTotal => UnitPrice * Quantity;

    public static OrderItem FromCartItem(CartItem ci) => new()
    {
        Id = Guid.NewGuid(),
        ProductId = ci.ProductId,
        VariantId = ci.VariantId,
        ProductName = ci.ProductName,
        VariantName = ci.VariantName,
        UnitPrice = ci.UnitPrice,
        Quantity = ci.Quantity,
    };
}
```

```csharp
// NhanViet.Domain/Entities/ContactMessage.cs
public class ContactMessage
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Subject { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;
    public bool IsRead { get; private set; }
    public DateTime CreatedAt { get; private set; }
}
```

```csharp
// NhanViet.Domain/Entities/AppUser.cs
// NOT extending IdentityUser — Supabase Auth manages the auth.users table.
// This table stores application-specific profile data, linked to Supabase auth.users via Id.

public class AppUser
{
    public Guid Id { get; set; }                // matches Supabase auth.users.id
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? AvatarUrl { get; set; }
    public string Role { get; set; } = "Customer";   // "Customer" | "Admin"
    public string? AuthProvider { get; set; }          // "email", "google", "facebook"
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public ICollection<Order> Orders { get; set; } = [];
    public Cart? Cart { get; set; }
}
```

**How Supabase Auth links to this entity:**
- When a user signs up via Supabase (email/password, Google, or Facebook), Supabase creates a row in `auth.users` with a UUID.
- The ASP.NET Core API receives the Supabase JWT, extracts the `sub` claim (the user's UUID), and uses that as `AppUser.Id`.
- On first API call from a new user, the API auto-creates an `AppUser` row in the `app_users` table (upsert pattern). This is handled by `ICurrentUserService.EnsureUserExistsAsync()`.
- Profile fields (FullName, Address, Phone) live in this application table, not in Supabase's `auth.users` metadata — keeping business data under EF Core control.

### 4.2 Enums

```csharp
// NhanViet.Domain/Enums/ProductCategory.cs
public enum ProductCategory
{
    Fresh,      // Nhãn lồng tươi
    Dried,      // Nhãn sấy
    Combo       // Combo quà biếu
}

// NhanViet.Domain/Enums/OrderStatus.cs
public enum OrderStatus
{
    Pending,    // Chờ xác nhận
    Confirmed,  // Đã xác nhận
    Shipping,   // Đang giao
    Completed,  // Hoàn thành
    Cancelled   // Đã hủy
}

// NhanViet.Domain/Enums/PaymentMethod.cs
public enum PaymentMethod
{
    Cod,        // Thanh toán khi nhận hàng
    Transfer    // Chuyển khoản ngân hàng
}
```

### 4.3 Domain Exceptions

```csharp
// NhanViet.Domain/Exceptions/
public class InsufficientStockException(Guid productId, Guid variantId, int available, int requested)
    : DomainException($"Variant {variantId} of product {productId}: requested {requested}, available {available}");

public class InvalidOrderStateException(Guid orderId, OrderStatus current, OrderStatus target)
    : DomainException($"Order {orderId} cannot transition from {current} to {target}");

public class CartItemNotFoundException(Guid productId, Guid variantId)
    : DomainException($"Cart item not found: product {productId}, variant {variantId}");

public abstract class DomainException(string message) : Exception(message);
```

### 4.4 Repository Interfaces (Domain Ports)

```csharp
// NhanViet.Domain/Interfaces/IProductRepository.cs
public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Product?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<(List<Product> Items, int TotalCount)> ListAsync(ProductFilter filter, CancellationToken ct = default);
    Task<List<string>> GetAllSlugsAsync(CancellationToken ct = default);
    Task AddAsync(Product product, CancellationToken ct = default);
    void Update(Product product);
    void Delete(Product product);
}

public record ProductFilter(
    ProductCategory? Category = null,
    bool? Featured = null,
    string? Search = null,
    int Page = 1,
    int PageSize = 12
);
```

```csharp
// NhanViet.Domain/Interfaces/ICartRepository.cs
public interface ICartRepository
{
    Task<Cart?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<Cart?> GetBySessionIdAsync(string sessionId, CancellationToken ct = default);
    Task AddAsync(Cart cart, CancellationToken ct = default);
    void Update(Cart cart);
    void Delete(Cart cart);
}
```

```csharp
// NhanViet.Domain/Interfaces/IOrderRepository.cs
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Order?> GetByCodeAsync(string orderCode, CancellationToken ct = default);
    Task<(List<Order> Items, int TotalCount)> ListByUserAsync(
        Guid userId, OrderStatus? status, int page, int pageSize, CancellationToken ct = default);
    Task AddAsync(Order order, CancellationToken ct = default);
    void Update(Order order);
}
```

---

## 5. Application Layer

Uses **CQRS** via **MediatR** to separate read and write paths. Each feature gets its own folder with Commands, Queries, DTOs, and Validators.

### 5.1 Shared Interfaces

```csharp
// NhanViet.Application/Common/Interfaces/IUnitOfWork.cs
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

// NhanViet.Application/Common/Interfaces/IEmailSender.cs
public interface IEmailSender
{
    Task SendContactNotificationAsync(string name, string email, string subject, string message);
    Task SendOrderConfirmationAsync(string email, string orderCode, decimal total);
}

// NhanViet.Application/Common/Interfaces/IFileStorageService.cs
// Implemented by SupabaseStorageService — uploads to Supabase Storage buckets
public interface IFileStorageService
{
    Task<string> UploadAsync(Stream stream, string bucket, string path, string contentType, CancellationToken ct = default);
    Task DeleteAsync(string bucket, string path, CancellationToken ct = default);
    string GetPublicUrl(string bucket, string path);
}

// NhanViet.Application/Common/Interfaces/ICurrentUserService.cs
public interface ICurrentUserService
{
    Guid? UserId { get; }
    bool IsAuthenticated { get; }
    bool IsAdmin { get; }
}
```

### 5.2 Example: Products Feature

```csharp
// --- Query: List Products ---
// NhanViet.Application/Products/Queries/ListProducts.cs

public record ListProductsQuery(
    ProductCategory? Category,
    bool? Featured,
    string? Search,
    int Page = 1,
    int PageSize = 12
) : IRequest<PagedResult<ProductDto>>;

public class ListProductsHandler(IProductRepository products) : IRequestHandler<ListProductsQuery, PagedResult<ProductDto>>
{
    public async Task<PagedResult<ProductDto>> Handle(ListProductsQuery req, CancellationToken ct)
    {
        var filter = new ProductFilter(req.Category, req.Featured, req.Search, req.Page, req.PageSize);
        var (items, total) = await products.ListAsync(filter, ct);
        return new PagedResult<ProductDto>(
            items.Select(p => p.ToDto()).ToList(),
            total,
            req.Page,
            req.PageSize
        );
    }
}
```

```csharp
// --- Query: Get Product By Slug ---
// NhanViet.Application/Products/Queries/GetProductBySlug.cs

public record GetProductBySlugQuery(string Slug) : IRequest<ProductDetailDto>;

public class GetProductBySlugHandler(IProductRepository products) : IRequestHandler<GetProductBySlugQuery, ProductDetailDto>
{
    public async Task<ProductDetailDto> Handle(GetProductBySlugQuery req, CancellationToken ct)
    {
        var product = await products.GetBySlugAsync(req.Slug, ct)
            ?? throw new NotFoundException(nameof(Product), req.Slug);
        return product.ToDetailDto();
    }
}
```

### 5.3 Example: Cart Feature

```csharp
// --- Command: Add to Cart ---
// NhanViet.Application/Cart/Commands/AddToCart.cs

public record AddToCartCommand(
    string ProductSlug,
    Guid VariantId,
    int Quantity
) : IRequest<CartDto>;

public class AddToCartHandler(
    ICartRepository carts,
    IProductRepository products,
    ICurrentUserService currentUser,
    IUnitOfWork uow
) : IRequestHandler<AddToCartCommand, CartDto>
{
    public async Task<CartDto> Handle(AddToCartCommand req, CancellationToken ct)
    {
        var product = await products.GetBySlugAsync(req.ProductSlug, ct)
            ?? throw new NotFoundException(nameof(Product), req.ProductSlug);

        var variant = product.Variants.FirstOrDefault(v => v.Id == req.VariantId)
            ?? throw new NotFoundException(nameof(ProductVariant), req.VariantId);

        var cart = currentUser.IsAuthenticated
            ? await carts.GetByUserIdAsync(currentUser.UserId!.Value, ct)
            : null;

        if (cart is null)
        {
            cart = new Cart { UserId = currentUser.UserId };
            await carts.AddAsync(cart, ct);
        }

        cart.AddItem(product, variant, req.Quantity);
        await uow.SaveChangesAsync(ct);

        return cart.ToDto();
    }
}
```

### 5.4 Example: Create Order

```csharp
// NhanViet.Application/Orders/Commands/CreateOrder.cs

public record CreateOrderCommand(
    string CustomerName,
    string CustomerPhone,
    string? CustomerEmail,
    string ShippingAddress,
    PaymentMethod PaymentMethod,
    string? Note
) : IRequest<OrderDto>;

public class CreateOrderValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderValidator()
    {
        RuleFor(x => x.CustomerName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.CustomerPhone).NotEmpty().Matches(@"^0\d{9}$")
            .WithMessage("Số điện thoại không hợp lệ");
        RuleFor(x => x.CustomerEmail).EmailAddress().When(x => x.CustomerEmail is not null);
        RuleFor(x => x.ShippingAddress).NotEmpty().MaximumLength(500);
        RuleFor(x => x.PaymentMethod).IsInEnum();
    }
}

public class CreateOrderHandler(
    ICartRepository carts,
    IOrderRepository orders,
    IProductRepository products,
    ICurrentUserService currentUser,
    IShippingCalculator shipping,
    IUnitOfWork uow,
    IEmailSender email
) : IRequestHandler<CreateOrderCommand, OrderDto>
{
    public async Task<OrderDto> Handle(CreateOrderCommand req, CancellationToken ct)
    {
        var cart = currentUser.IsAuthenticated
            ? await carts.GetByUserIdAsync(currentUser.UserId!.Value, ct)
            : throw new ValidationException("Cart not found");

        if (cart is null || cart.Items.Count == 0)
            throw new ValidationException("Giỏ hàng trống");

        // Validate stock and deduct
        foreach (var item in cart.Items)
        {
            var product = await products.GetByIdAsync(item.ProductId, ct)
                ?? throw new NotFoundException(nameof(Product), item.ProductId);
            var variant = product.Variants.First(v => v.Id == item.VariantId);
            variant.DeductStock(item.Quantity);
        }

        var shippingFee = shipping.Calculate(cart.Subtotal);

        var order = Order.CreateFromCart(
            cart, req.CustomerName, req.CustomerPhone, req.CustomerEmail,
            req.ShippingAddress, req.PaymentMethod, req.Note, shippingFee);

        await orders.AddAsync(order, ct);
        cart.Clear();
        await uow.SaveChangesAsync(ct);

        if (req.CustomerEmail is not null)
            await email.SendOrderConfirmationAsync(req.CustomerEmail, order.OrderCode, order.Total);

        return order.ToDto();
    }
}
```

### 5.5 DTOs

```csharp
// NhanViet.Application/Products/DTOs/

public record ProductDto(
    Guid Id,
    string Slug,
    string Name,
    string Description,
    decimal Price,
    decimal? OldPrice,
    string Unit,
    string Image,
    string Category,
    string? Badge,
    decimal Rating,
    bool Featured
);

public record ProductDetailDto(
    Guid Id,
    string Slug,
    string Name,
    string Description,
    string? FullDescription,
    decimal Price,
    decimal? OldPrice,
    string Unit,
    string Image,
    List<string> Images,
    string Category,
    string? Badge,
    decimal Rating,
    bool Featured,
    string? Origin,
    string? Harvest,
    string? Packaging,
    string? Storage,
    string? Shipping,
    List<VariantDto> Variants
);

public record VariantDto(
    Guid Id,
    string Name,
    decimal Price,
    decimal? OldPrice,
    int Stock,
    bool InStock,
    int DiscountPercent
);

// NhanViet.Application/Cart/DTOs/
public record CartDto(
    List<CartItemDto> Items,
    decimal Subtotal,
    int TotalCount
);

public record CartItemDto(
    Guid ProductId,
    Guid VariantId,
    string ProductName,
    string VariantName,
    string ProductImage,
    string Unit,
    decimal UnitPrice,
    int Quantity,
    decimal LineTotal
);

// NhanViet.Application/Orders/DTOs/
public record OrderDto(
    Guid Id,
    string OrderCode,
    string Status,
    decimal Subtotal,
    decimal ShippingFee,
    decimal Total,
    string PaymentMethod,
    string CustomerName,
    string CustomerPhone,
    string ShippingAddress,
    string? Note,
    DateTime CreatedAt,
    List<OrderItemDto> Items
);

public record OrderItemDto(
    string ProductName,
    string VariantName,
    decimal UnitPrice,
    int Quantity,
    decimal LineTotal
);
```

### 5.6 MediatR Pipeline Behaviors

```csharp
// Validation behavior — runs FluentValidation before every handler
public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        if (!validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);
        var failures = (await Task.WhenAll(validators.Select(v => v.ValidateAsync(context, ct))))
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .ToList();

        if (failures.Count > 0)
            throw new ValidationException(failures);

        return await next();
    }
}
```

---

## 6. Infrastructure Layer

### 6.1 EF Core DbContext (Supabase PostgreSQL)

```csharp
// NhanViet.Infrastructure/Data/NhanVietDbContext.cs
// Plain DbContext — NOT IdentityDbContext. Supabase Auth owns auth.users;
// we only manage application tables in the "public" schema.

public class NhanVietDbContext(DbContextOptions<NhanVietDbContext> options)
    : DbContext(options), IUnitOfWork
{
    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderStatusHistory> OrderStatusHistories => Set<OrderStatusHistory>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // All application tables live in the "public" schema.
        // Supabase reserves "auth", "storage", "realtime" schemas — do not touch those.
        builder.HasDefaultSchema("public");

        builder.ApplyConfigurationsFromAssembly(typeof(NhanVietDbContext).Assembly);
    }
}
```

> **Supabase connection note:** EF Core connects to Supabase PostgreSQL using the **direct connection** string (port 5432), not the pooled Supavisor connection (port 6543). The direct connection is required for EF Core migrations. For production query traffic, you can optionally switch to the pooled connection string (Transaction mode) — but only if you are not running migrations in the same process.
>
> ```
> // Direct (for migrations + development):
> Host=db.<project-ref>.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=<db-password>
>
> // Pooled via Supavisor (for production query traffic):
> Host=aws-0-<region>.pooler.supabase.com;Port=6543;Database=postgres;Username=postgres.<project-ref>;Password=<db-password>
> ```

### 6.2 Entity Configuration Example

```csharp
// NhanViet.Infrastructure/Data/Configurations/ProductConfiguration.cs

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Slug).HasMaxLength(200).IsRequired();
        builder.HasIndex(p => p.Slug).IsUnique();

        builder.Property(p => p.Name).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Description).HasMaxLength(500);
        builder.Property(p => p.FullDescription).HasMaxLength(2000);
        builder.Property(p => p.Unit).HasMaxLength(50);
        builder.Property(p => p.Image).HasMaxLength(500);
        builder.Property(p => p.Badge).HasMaxLength(50);
        builder.Property(p => p.Origin).HasMaxLength(500);
        builder.Property(p => p.Harvest).HasMaxLength(500);
        builder.Property(p => p.Packaging).HasMaxLength(500);

        builder.Property(p => p.Rating).HasPrecision(3, 1);

        builder.Property(p => p.Category)
            .HasConversion<string>()
            .HasMaxLength(20);

        // Store images as JSON column
        builder.Property(p => p.Images)
            .HasColumnType("jsonb");       // PostgreSQL; use nvarchar(max) for SQL Server

        builder.HasMany(p => p.Variants)
            .WithOne(v => v.Product)
            .HasForeignKey(v => v.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(p => p.Category);
        builder.HasIndex(p => p.Featured);
        builder.HasIndex(p => p.IsActive);
    }
}
```

### 6.3 Data Seeder

```csharp
// NhanViet.Infrastructure/Data/Seed/ProductSeeder.cs
// Seeds the 12 products from the frontend's products.ts into the database on first run.
// Maps the frontend string IDs → new Guids, preserving slugs and variant structure.

public static class ProductSeeder
{
    public static async Task SeedAsync(NhanVietDbContext db)
    {
        if (await db.Products.AnyAsync()) return;

        var products = GetInitialProducts();
        db.Products.AddRange(products);
        await db.SaveChangesAsync();
    }

    private static List<Product> GetInitialProducts()
    {
        // Returns the 12 products from the frontend data, mapped to domain entities.
        // Slugs: nhan-long-tuoi-loai-1, nhan-long-tuoi-nguyen-chum, nhan-say-deo, etc.
        // Each with their variants and prices in VND.
        // (Full implementation omitted for brevity — mirrors products.ts exactly)
        return [];
    }
}
```

### 6.4 Repository Implementation

```csharp
// NhanViet.Infrastructure/Repositories/ProductRepository.cs

public class ProductRepository(NhanVietDbContext db) : IProductRepository
{
    public async Task<Product?> GetBySlugAsync(string slug, CancellationToken ct) =>
        await db.Products
            .Include(p => p.Variants.Where(v => v.IsActive))
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive, ct);

    public async Task<(List<Product> Items, int TotalCount)> ListAsync(ProductFilter filter, CancellationToken ct)
    {
        var query = db.Products
            .Include(p => p.Variants.Where(v => v.IsActive))
            .Where(p => p.IsActive)
            .AsQueryable();

        if (filter.Category.HasValue)
            query = query.Where(p => p.Category == filter.Category.Value);

        if (filter.Featured.HasValue)
            query = query.Where(p => p.Featured == filter.Featured.Value);

        if (!string.IsNullOrWhiteSpace(filter.Search))
            query = query.Where(p =>
                EF.Functions.ILike(p.Name, $"%{filter.Search}%") ||
                EF.Functions.ILike(p.Description, $"%{filter.Search}%"));

        var total = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(p => p.Featured)
            .ThenByDescending(p => p.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    // ... other methods
}
```

---

## 7. API Layer (Presentation)

### 7.1 Program.cs — Composition Root

```csharp
// NhanViet.Api/Program.cs

var builder = WebApplication.CreateBuilder(args);

// --- Services ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Supabase JWT token. Obtain from Supabase Auth (login/OAuth).",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// Application layer
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(ListProductsQuery).Assembly));
builder.Services.AddValidatorsFromAssembly(typeof(CreateOrderValidator).Assembly);
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

// Infrastructure layer — Supabase PostgreSQL via EF Core
builder.Services.AddDbContext<NhanVietDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("SupabaseDirectConnection")));

// ─── Authentication: Supabase JWT via OIDC Discovery + JWKS (RSA) ───
// No ASP.NET Core Identity. Supabase handles registration, login, OAuth, password reset.
// The .NET API cryptographically verifies the JWT signature using Supabase's RSA public key.
//
// How it works, step by step:
//   1. On startup, AddJwtBearer fetches {SupabaseUrl}/auth/v1/.well-known/openid-configuration
//   2. That OIDC metadata document points to the JWKS URI (JSON Web Key Set)
//   3. The middleware downloads the RSA public key(s) from the JWKS endpoint
//   4. On each request, the middleware cryptographically verifies the JWT signature using RSA
//   5. It then validates issuer, audience, and expiry
//   6. On success, HttpContext.User is populated with all JWT claims (including "sub")
//
// Keys are cached and auto-refreshed — no manual key management required.

var supabaseUrl = builder.Configuration["Supabase:Url"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Step 1: Point to Supabase's OIDC discovery endpoint.
        // The middleware will GET {Authority}/.well-known/openid-configuration
        // which returns the JWKS URI, supported algorithms, issuer, etc.
        options.Authority = $"{supabaseUrl}/auth/v1";

        // Step 2-3: The middleware automatically fetches the JWKS (RSA public keys)
        // from the URI discovered in step 1. No manual key configuration needed.
        // Keys are cached in memory and refreshed when a token has an unknown "kid".

        // Step 4-5: Configure what to validate after signature verification.
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Validate issuer matches Supabase's auth endpoint
            ValidateIssuer = true,
            ValidIssuer = $"{supabaseUrl}/auth/v1",

            // Validate audience — Supabase sets "aud" to "authenticated" for logged-in users
            ValidateAudience = true,
            ValidAudience = "authenticated",

            // Validate token hasn't expired (checks "exp" claim against current UTC time)
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30),  // tight skew for security

            // Validate the RSA signature — the signing key is fetched from JWKS (step 2-3)
            ValidateIssuerSigningKey = true,
            // IssuerSigningKey is NOT set manually — it comes from JWKS discovery

            // Map Supabase's "sub" claim to ClaimTypes.NameIdentifier
            NameClaimType = "sub",
        };

        // Disable HTTPS metadata requirement in development (Supabase CLI runs on HTTP)
        if (builder.Environment.IsDevelopment())
        {
            options.RequireHttpsMetadata = false;
        }

        // Step 6: After successful validation, HttpContext.User.Claims contains all JWT claims.
        // The OnTokenValidated event fires after the signature is verified and all validations pass.
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                // Auto-provision AppUser row on first API call from a new Supabase user
                var db = context.HttpContext.RequestServices.GetRequiredService<NhanVietDbContext>();
                var userId = Guid.Parse(context.Principal!.FindFirst("sub")!.Value);
                var email = context.Principal.FindFirst("email")?.Value ?? "";
                var provider = context.Principal.FindFirst("app_metadata.provider")?.Value ?? "email";

                if (!await db.AppUsers.AnyAsync(u => u.Id == userId))
                {
                    db.AppUsers.Add(new AppUser
                    {
                        Id = userId,
                        Email = email,
                        FullName = context.Principal.FindFirst("user_metadata.full_name")?.Value ?? "",
                        AuthProvider = provider,
                        AvatarUrl = context.Principal.FindFirst("user_metadata.avatar_url")?.Value,
                        CreatedAt = DateTime.UtcNow,
                    });
                    await db.SaveChangesAsync();
                }
            }
        };
    });

// Authorization policies
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("AdminOnly", policy =>
        policy.RequireAssertion(ctx =>
        {
            // Check custom app_metadata.role claim set via Supabase Admin API
            var roleClaim = ctx.User.FindFirst("app_metadata.role")?.Value;
            return roleClaim == "Admin";
        }));

// Repositories & services (no caching — direct DB queries for now)
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<NhanVietDbContext>());
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IShippingCalculator, ShippingCalculator>();
builder.Services.AddScoped<IEmailSender, SmtpEmailSender>();
builder.Services.AddScoped<IFileStorageService, SupabaseStorageService>();
builder.Services.AddHttpClient<ISupabaseAdminService, SupabaseAdminService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(
                builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()!)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Rate limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("api", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 100;
    });
});

var app = builder.Build();

// --- Middleware pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.MapControllers();

// Seed data (runs EF Core migrations against Supabase PostgreSQL)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<NhanVietDbContext>();
    await db.Database.MigrateAsync();
    await ProductSeeder.SeedAsync(db);
}

app.Run();
```

> **Note on caching:** No caching layer is configured. All queries hit Supabase PostgreSQL directly. This is intentional for the initial launch — the product catalog is small (~12 products) and Supabase connection pooling (Supavisor) handles concurrent connections efficiently. A caching layer (IMemoryCache or Redis) will be added in a future phase when traffic warrants it.

---

## 8. Database Schema

### ER Diagram (text)

```
┌──────────────┐       ┌──────────────────┐
│  AppUsers    │──1:N──│     Orders       │
│  (Id=Supa.)  │       │  OrderCode       │
│  FullName    │       │  Status          │
│  Email       │       │  Total           │
│  Role        │       │  CustomerName    │
│  AuthProvider│       │  CustomerPhone   │
└──────┬───────┘       │  CustomerPhone   │
       │               │  ShippingAddress │
       │ 1:1           │  PaymentMethod   │
       │               └───────┬──────────┘
┌──────┴───────┐               │ 1:N
│    Carts     │       ┌───────┴──────────┐
│  SessionId   │       │   OrderItems     │
└──────┬───────┘       │  ProductName     │
       │ 1:N           │  VariantName     │
┌──────┴───────┐       │  UnitPrice       │
│  CartItems   │       │  Quantity        │
│  ProductId   │       └──────────────────┘
│  VariantId   │
│  UnitPrice   │       ┌──────────────────┐
│  Quantity    │       │  OrderStatusHist │
└──────────────┘       │  Status          │
                       │  Timestamp       │
┌──────────────┐       │  Reason          │
│  Products    │       └──────────────────┘
│  Slug (UQ)   │
│  Name        │       ┌──────────────────┐
│  Category    │       │ ContactMessages  │
│  Featured    │       │  Name            │
│  IsActive    │       │  Phone           │
└──────┬───────┘       │  Email           │
       │ 1:N           │  Subject         │
┌──────┴───────┐       │  Message         │
│ProductVariant│       │  IsRead          │
│  Name        │       └──────────────────┘
│  Price       │
│  OldPrice    │
│  Stock       │
│  IsActive    │
└──────────────┘
```

### Key indexes

| Table | Column(s) | Type |
|---|---|---|
| Products | Slug | Unique |
| Products | Category | Non-unique |
| Products | Featured, IsActive | Composite |
| Orders | OrderCode | Unique |
| Orders | UserId, Status | Composite |
| Orders | CreatedAt | Descending |
| Carts | UserId | Unique (where not null) |
| Carts | SessionId | Unique (where not null) |

---

## 9. API Endpoints

### 9.1 Products (public)

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/products` | List products (paginated, filterable) | No |
| GET | `/api/products/{slug}` | Get product detail by slug | No |
| GET | `/api/products/slugs` | Get all slugs (for SSG) | No |
| GET | `/api/products/featured` | Get featured products | No |

**Query parameters for `GET /api/products`:**
- `category` — `fresh`, `dried`, `combo`
- `featured` — `true`/`false`
- `search` — keyword search
- `page` — default 1
- `pageSize` — default 12, max 50

**Response format:**
```json
{
  "items": [
    {
      "id": "...",
      "slug": "nhan-long-tuoi-loai-1",
      "name": "Nhãn lồng tươi loại 1",
      "description": "Cùi dày, hạt nhỏ, ngọt thanh",
      "price": 69000,
      "oldPrice": null,
      "unit": "kg",
      "image": "https://...",
      "category": "fresh",
      "badge": "Bán chạy",
      "rating": 5.0,
      "featured": true
    }
  ],
  "totalCount": 12,
  "page": 1,
  "pageSize": 12,
  "totalPages": 1
}
```

### 9.2 Cart

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/cart` | Get current cart | Optional* |
| POST | `/api/cart/items` | Add item to cart | Optional* |
| PUT | `/api/cart/items/{productId}/{variantId}` | Update quantity | Optional* |
| DELETE | `/api/cart/items/{productId}/{variantId}` | Remove item | Optional* |
| DELETE | `/api/cart` | Clear cart | Optional* |

*Guest users identified by a session token in a cookie or Authorization header.

### 9.3 Orders

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/orders` | Create order from cart | Yes |
| GET | `/api/orders` | List user's orders (filtered) | Yes |
| GET | `/api/orders/{id}` | Get order detail | Yes |
| POST | `/api/orders/{id}/cancel` | Cancel pending order | Yes |

**Query parameters for `GET /api/orders`:**
- `status` — `pending`, `confirmed`, `shipping`, `completed`, `cancelled`
- `page`, `pageSize`

### 9.4 User Profile (auth handled by Supabase)

> Registration, login, password reset, and OAuth (Google/Facebook) are handled entirely by the frontend calling Supabase Auth directly. The .NET API does not expose login/register endpoints.

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/auth/me` | Get current user profile from `app_users` | Yes |
| PUT | `/api/auth/me` | Update profile (name, phone, address) | Yes |
| POST | `/api/auth/me/avatar` | Upload avatar to Supabase Storage | Yes |
| DELETE | `/api/auth/me` | Delete account | Yes |

**GET `/api/auth/me` response:**
```json
{
  "id": "a1b2c3d4-...",
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A",
  "phone": "0866918366",
  "address": "Hà Nội, Việt Nam",
  "avatarUrl": "https://<project>.supabase.co/storage/v1/object/public/avatars/...",
  "authProvider": "google",
  "role": "Customer",
  "createdAt": "2026-05-13T10:00:00Z"
}
```

**PUT `/api/auth/me` request:**
```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0866918366",
  "address": "123 Đường ABC, Quận 1, TP.HCM"
}
```

### 9.5 Contact

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/contact` | Submit contact form | No (rate-limited) |

**Request:**
```json
{
  "name": "Nguyễn Văn A",
  "phone": "0866918366",
  "email": "user@example.com",
  "subject": "Hỏi về sản phẩm",
  "message": "Tôi muốn biết thêm về nhãn lồng tươi loại 1..."
}
```

### 9.6 Admin (protected, `Admin` role required)

| Method | Route | Description |
|---|---|---|
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/{id}` | Update product |
| DELETE | `/api/admin/products/{id}` | Soft-delete product |
| POST | `/api/admin/products/{id}/images` | Upload product images |
| GET | `/api/admin/orders` | List all orders |
| PUT | `/api/admin/orders/{id}/status` | Update order status |
| GET | `/api/admin/contacts` | List contact messages |
| PUT | `/api/admin/contacts/{id}/read` | Mark contact as read |
| GET | `/api/admin/dashboard` | Dashboard stats |

---

## 10. Authentication & Authorization

### Architecture: Supabase Auth + OIDC/JWKS Cryptographic Verification

Authentication is **fully delegated to Supabase Auth**. The .NET API server does **not** handle registration, login, password hashing, OAuth callbacks, or token issuance. Instead, it **cryptographically verifies** every incoming JWT using Supabase's RSA public key, fetched automatically via OIDC discovery.

### How JWT Verification Works (step by step)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ On startup (one-time, cached):                                              │
│                                                                             │
│  1. ASP.NET Core fetches:                                                   │
│     GET {SupabaseUrl}/auth/v1/.well-known/openid-configuration              │
│     ↓ returns JSON with "jwks_uri" field                                    │
│                                                                             │
│  2. ASP.NET Core fetches the JWKS URI:                                      │
│     GET {SupabaseUrl}/auth/v1/.well-known/jwks.json                         │
│     ↓ returns the RSA public key(s) in JWK format                           │
│                                                                             │
│  3. The RSA public key is cached in memory.                                 │
│     It auto-refreshes when a token arrives with an unknown "kid" (key ID).  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ On every request with Authorization: Bearer <token>:                        │
│                                                                             │
│  4. CRYPTOGRAPHIC SIGNATURE VERIFICATION                                    │
│     The middleware decodes the JWT header to get the "kid" (key ID),        │
│     looks up the matching RSA public key from the cached JWKS,              │
│     and verifies the signature using RSA-SHA256 (RS256).                    │
│     → If the signature is invalid → 401 Unauthorized (token was tampered)   │
│                                                                             │
│  5. CLAIMS VALIDATION                                                       │
│     After signature verification, the middleware checks:                     │
│     • "iss" (issuer) == "{SupabaseUrl}/auth/v1"                            │
│     • "aud" (audience) == "authenticated"                                   │
│     • "exp" (expiry) > current UTC time (with 30s clock skew)               │
│     → If any check fails → 401 Unauthorized                                │
│                                                                             │
│  6. POPULATE HttpContext.User                                               │
│     All JWT claims become ClaimsPrincipal claims:                            │
│     • "sub" → user UUID (AppUser.Id)                                        │
│     • "email" → user email                                                  │
│     • "app_metadata.provider" → "email" | "google" | "facebook"            │
│     • "app_metadata.role" → "Admin" (if set)                               │
│     • "user_metadata.full_name" → display name from OAuth                  │
│     HttpContext.User.Identity.IsAuthenticated == true                       │
│                                                                             │
│  7. OnTokenValidated event fires → auto-provision AppUser if new            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why JWKS/OIDC discovery instead of a shared secret?

| Approach | How it works | Tradeoff |
|---|---|---|
| **Symmetric (HS256 + JWT secret)** | API and Supabase share the same secret key. API validates by re-computing the HMAC. | Simpler config, but the JWT secret is a **master key** — if leaked, an attacker can forge any token. Also couples key rotation to manual config changes. |
| **Asymmetric (RS256 + JWKS) ✓** | Supabase signs with a private key. API fetches the **public** key via OIDC discovery and verifies. | The API never holds a secret that can forge tokens. Key rotation is automatic (Supabase publishes new keys, middleware fetches them). Industry standard for OIDC/OAuth2. |

The JWKS approach is what `AddJwtBearer` with `options.Authority` does out of the box — zero custom key management code.

### Auth Flow — Email/Password

```
Frontend                    Supabase Auth              .NET API
  │                              │                        │
  │──signUp(email, pass)────────►│                        │
  │◄──{ user, session, jwt }─────│                        │
  │                              │                        │
  │──signInWithPassword─────────►│                        │
  │◄──{ access_token, refresh }──│                        │
  │                              │                        │
  │──GET /api/orders─────────────┼───────────────────────►│
  │  Authorization: Bearer <jwt> │                        │── Validate JWT (Supabase secret)
  │                              │                        │── Extract sub (user UUID)
  │◄─────────────────────────────┼──{ orders: [...] }─────│
  │                              │                        │
  │──supabase.auth.refreshSession►│                       │
  │◄──{ new access_token }───────│                        │
```

### Auth Flow — Google / Facebook OAuth

```
Frontend                    Supabase Auth              Google/Facebook
  │                              │                        │
  │──signInWithOAuth({           │                        │
  │    provider: 'google'        │                        │
  │  })─────────────────────────►│                        │
  │                              │──OAuth redirect───────►│
  │◄─────────────────────────────│◄──auth code────────────│
  │  (redirect back with token)  │                        │
  │                              │── Exchanges code        │
  │                              │── Creates/links user    │
  │◄──{ access_token, user }─────│                        │
  │                              │                        │
  │──GET /api/cart───────────────┼───────────────────────►│ .NET API
  │  Authorization: Bearer <jwt> │                        │── Same JWT validation
  │◄─────────────────────────────┼──{ cart }──────────────│
```

### Supabase Dashboard Configuration

Before the .NET API works, configure these in the **Supabase Dashboard** → Authentication → Providers:

| Provider | Setup |
|---|---|
| **Email** | Enabled by default. Configure email templates for Vietnamese copy. |
| **Google** | Enable → paste Google OAuth Client ID + Client Secret (from Google Cloud Console → Credentials → OAuth 2.0) |
| **Facebook** | Enable → paste Facebook App ID + App Secret (from Meta Developer Console → App Settings → Basic) |

**Redirect URLs** (set in Supabase Dashboard → Authentication → URL Configuration):
- Site URL: `https://nhanviet.vn` (production) or `http://localhost:3000` (dev)
- Redirect URLs: `https://nhanviet.vn/auth/callback`, `http://localhost:3000/auth/callback`

### Frontend Auth Code (for reference)

```typescript
// Frontend: lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Email login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'SecurePass123!',
});

// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/auth/callback` },
});

// Facebook OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'facebook',
  options: { redirectTo: `${window.location.origin}/auth/callback` },
});

// Send JWT to .NET API
const { data: { session } } = await supabase.auth.getSession();
const res = await fetch('http://localhost:5000/api/orders', {
  headers: { Authorization: `Bearer ${session?.access_token}` },
});
```

### JWT Claims from Supabase

A decoded Supabase JWT contains:

```json
{
  "sub": "a1b2c3d4-e5f6-...",          // User UUID — this is AppUser.Id
  "email": "user@example.com",
  "phone": "",
  "app_metadata": {
    "provider": "google",               // "email", "google", "facebook"
    "providers": ["google"],
    "role": "Admin"                      // custom — set via Supabase Admin API
  },
  "user_metadata": {
    "full_name": "Nguyễn Văn A",        // from OAuth profile
    "avatar_url": "https://..."          // from OAuth profile
  },
  "role": "authenticated",
  "aud": "authenticated",
  "iss": "https://<project>.supabase.co/auth/v1",
  "exp": 1717200000
}
```

### ICurrentUserService Implementation

```csharp
// NhanViet.Infrastructure/Services/CurrentUserService.cs

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    private ClaimsPrincipal? User => httpContextAccessor.HttpContext?.User;

    public Guid? UserId => User?.FindFirst("sub")?.Value is { } sub
        ? Guid.Parse(sub)
        : null;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;

    public string? Email => User?.FindFirst("email")?.Value;

    public string? AuthProvider => User?.FindFirst("app_metadata.provider")?.Value;

    public bool IsAdmin =>
        User?.FindFirst("app_metadata.role")?.Value == "Admin";
}
```

### Assigning Admin Role

Admin role is stored in Supabase's `app_metadata` via the **Supabase Admin API** (service_role key, server-side only):

```csharp
// NhanViet.Infrastructure/Services/SupabaseAdminService.cs

public interface ISupabaseAdminService
{
    Task SetUserRoleAsync(Guid userId, string role);
}

public class SupabaseAdminService(HttpClient http, IConfiguration config) : ISupabaseAdminService
{
    public async Task SetUserRoleAsync(Guid userId, string role)
    {
        var supabaseUrl = config["Supabase:Url"]!;
        var serviceKey = config["Supabase:ServiceRoleKey"]!;

        var request = new HttpRequestMessage(HttpMethod.Put,
            $"{supabaseUrl}/auth/v1/admin/users/{userId}");
        request.Headers.Add("apikey", serviceKey);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", serviceKey);
        request.Content = JsonContent.Create(new
        {
            app_metadata = new { role }
        });

        var response = await http.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }
}
```

### Roles

| Role | Access | How assigned |
|---|---|---|
| `authenticated` | Supabase default for any logged-in user | Automatic |
| `Customer` | Cart, orders, profile (own data) | Default `AppUser.Role` on creation |
| `Admin` | All customer operations + admin endpoints | Set via `SupabaseAdminService.SetUserRoleAsync()` |

### Guest Cart Strategy

Guests get a **session cookie** (`nv-session-id`) containing a GUID. Their cart is stored server-side associated with this session ID. When they register or log in (via any method — email, Google, or Facebook), the guest cart is **merged** into their authenticated user cart.

### Auth API Endpoints (reduced scope)

Since Supabase handles registration/login/OAuth, the .NET API auth endpoints are minimal:

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/auth/me` | Get current user profile (from `app_users` table) | Yes |
| PUT | `/api/auth/me` | Update profile (name, phone, address) | Yes |
| POST | `/api/auth/me/avatar` | Upload avatar to Supabase Storage | Yes |
| DELETE | `/api/auth/me` | Delete account (removes `app_users` row + calls Supabase Admin delete) | Yes |

Registration, login, password reset, and OAuth are handled entirely by the frontend talking to Supabase Auth — the .NET API is not involved.

---

## 11. Business Rules

### 11.1 Shipping Fee Calculation

Mirrors the frontend logic in `CartModal.tsx`:

```csharp
// NhanViet.Application/Common/Interfaces/IShippingCalculator.cs
public interface IShippingCalculator
{
    decimal Calculate(decimal subtotal);
}

// NhanViet.Infrastructure/Services/ShippingCalculator.cs
public class ShippingCalculator : IShippingCalculator
{
    private const decimal FreeShippingThreshold = 499_000m;
    private const decimal StandardShippingFee = 30_000m;

    public decimal Calculate(decimal subtotal) =>
        subtotal >= FreeShippingThreshold ? 0m : StandardShippingFee;
}
```

### 11.2 Order State Machine

```
Pending ──► Confirmed ──► Shipping ──► Completed
   │
   └──────► Cancelled (from Pending only for customers)
             (Admin can cancel from Pending or Confirmed)
```

### 11.3 Stock Management

- **Deduct** stock when an order is created (not when added to cart)
- **Restore** stock when an order is cancelled
- Cart items are validated against current stock at checkout time
- No reservation system (simple approach for initial launch)

### 11.4 Price Integrity

- Cart stores `UnitPrice` snapshotted at add-time
- At checkout, prices are **re-validated** against current product variant prices
- If a price has changed, the cart item is updated and the user is notified

### 11.5 Order Code Generation

Format: `DH` + `yyMMdd` + 4-digit random = `DH260513XXXX`

---

## 12. Error Handling

### Global Exception Middleware

```csharp
// NhanViet.Api/Middleware/ExceptionHandlingMiddleware.cs

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, response) = exception switch
        {
            NotFoundException e => (404, new ProblemDetails
            {
                Title = "Not Found",
                Detail = e.Message,
                Status = 404,
            }),
            ValidationException e => (400, new ProblemDetails
            {
                Title = "Validation Error",
                Detail = "One or more validation errors occurred.",
                Status = 400,
                Extensions = { ["errors"] = e.Errors },
            }),
            DomainException e => (422, new ProblemDetails
            {
                Title = "Business Rule Violation",
                Detail = e.Message,
                Status = 422,
            }),
            UnauthorizedAccessException => (401, new ProblemDetails
            {
                Title = "Unauthorized",
                Status = 401,
            }),
            _ => (500, new ProblemDetails
            {
                Title = "Internal Server Error",
                Detail = "An unexpected error occurred.",
                Status = 500,
            }),
        };

        if (statusCode == 500)
            logger.LogError(exception, "Unhandled exception");

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsJsonAsync(response);
    }
}
```

### Standard API Response Envelope

All error responses follow **RFC 7807 Problem Details**. Success responses return the data directly (no envelope wrapper — let HTTP status codes speak).

---

## 13. CORS & Frontend Integration

### appsettings.json

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://nhanviet.vn"
    ]
  }
}
```

### Frontend Integration Pattern

The Next.js (or Vite) frontend calls the API via `fetch` or a thin wrapper:

```typescript
// Frontend: lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include', // send cookies for session
  });

  if (!res.ok) {
    const problem = await res.json();
    throw new ApiError(problem);
  }

  return res.json();
}
```

### API URL Configuration

| Environment | Frontend URL | Backend URL |
|---|---|---|
| Development | `http://localhost:3000` | `http://localhost:5000` |
| Staging | `https://staging.nhanviet.vn` | `https://api-staging.nhanviet.vn` |
| Production | `https://nhanviet.vn` | `https://api.nhanviet.vn` |

---

## 14. Logging & Observability

### Serilog Configuration

```csharp
// Program.cs
builder.Host.UseSerilog((context, config) => config
    .ReadFrom.Configuration(context.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "NhanViet.Api")
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day));
```

### Health Checks

```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("SupabaseDirectConnection")!)  // Supabase PostgreSQL
    .AddCheck("self", () => HealthCheckResult.Healthy());

app.MapHealthChecks("/health");
```

### Key Metrics to Track

- Request count/latency per endpoint
- Order creation rate
- Auth failure rate (brute-force detection)
- Stock depletion alerts
- Contact form submission rate

---

## 15. Testing Strategy

### Test Projects

| Project | Scope | Tools |
|---|---|---|
| `NhanViet.Domain.Tests` | Entity behavior, domain services, value objects | xUnit, FluentAssertions |
| `NhanViet.Application.Tests` | Use case handlers, validators | xUnit, Moq/NSubstitute, FluentAssertions |
| `NhanViet.Infrastructure.Tests` | Repository queries, EF configurations | xUnit, Testcontainers (PostgreSQL), FluentAssertions |
| `NhanViet.Api.IntegrationTests` | Full HTTP pipeline, auth flows | xUnit, `WebApplicationFactory<Program>`, Testcontainers |

### Example: Domain Test

```csharp
public class CartTests
{
    [Fact]
    public void AddItem_NewItem_AddsToCart()
    {
        var cart = new Cart();
        var product = CreateTestProduct();
        var variant = product.Variants.First();

        cart.AddItem(product, variant, 2);

        cart.Items.Should().HaveCount(1);
        cart.Items.First().Quantity.Should().Be(2);
        cart.Subtotal.Should().Be(variant.Price * 2);
    }

    [Fact]
    public void AddItem_ExistingVariant_IncrementsQuantity()
    {
        var cart = new Cart();
        var product = CreateTestProduct();
        var variant = product.Variants.First();

        cart.AddItem(product, variant, 1);
        cart.AddItem(product, variant, 2);

        cart.Items.Should().HaveCount(1);
        cart.Items.First().Quantity.Should().Be(3);
    }

    [Fact]
    public void AddItem_ExceedsStock_ThrowsInsufficientStockException()
    {
        var cart = new Cart();
        var product = CreateTestProduct(); // variant has stock = 10
        var variant = product.Variants.First();

        var act = () => cart.AddItem(product, variant, 999);

        act.Should().Throw<InsufficientStockException>();
    }
}
```

### Example: Integration Test

```csharp
public class ProductsEndpointTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task GetProducts_ReturnsSeededProducts()
    {
        var response = await _client.GetAsync("/api/products");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<PagedResult<ProductDto>>();
        result!.Items.Should().NotBeEmpty();
        result.Items.Should().AllSatisfy(p => p.Slug.Should().NotBeNullOrEmpty());
    }

    [Fact]
    public async Task GetProductBySlug_ValidSlug_ReturnsProduct()
    {
        var response = await _client.GetAsync("/api/products/nhan-long-tuoi-loai-1");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var product = await response.Content.ReadFromJsonAsync<ProductDetailDto>();
        product!.Name.Should().Be("Nhãn lồng tươi loại 1");
        product.Variants.Should().NotBeEmpty();
    }

    [Fact]
    public async Task GetProductBySlug_InvalidSlug_Returns404()
    {
        var response = await _client.GetAsync("/api/products/nonexistent");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
```

---

## 16. Deployment

### Docker

```dockerfile
# NhanViet.Api/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/NhanViet.Api/NhanViet.Api.csproj", "NhanViet.Api/"]
COPY ["src/NhanViet.Application/NhanViet.Application.csproj", "NhanViet.Application/"]
COPY ["src/NhanViet.Domain/NhanViet.Domain.csproj", "NhanViet.Domain/"]
COPY ["src/NhanViet.Infrastructure/NhanViet.Infrastructure.csproj", "NhanViet.Infrastructure/"]
RUN dotnet restore "NhanViet.Api/NhanViet.Api.csproj"
COPY src/ .
RUN dotnet publish "NhanViet.Api/NhanViet.Api.csproj" -c Release -o /app/publish

FROM base AS final
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "NhanViet.Api.dll"]
```

### docker-compose.yml

Since the database is hosted on Supabase (not local), docker-compose only runs the API container. Connection strings point to the remote Supabase PostgreSQL instance.

```yaml
services:
  api:
    build:
      context: .
      dockerfile: src/NhanViet.Api/Dockerfile
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__SupabaseDirectConnection=Host=db.<project-ref>.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=${SUPABASE_DB_PASSWORD}
      - Supabase__Url=https://<project-ref>.supabase.co
      - Supabase__ServiceRoleKey=${SUPABASE_SERVICE_ROLE_KEY}
      - Supabase__AnonKey=${SUPABASE_ANON_KEY}
    env_file:
      - .env    # contains SUPABASE_DB_PASSWORD, SUPABASE_SERVICE_ROLE_KEY, etc.
      # No SUPABASE_JWT_SECRET needed — JWT verification uses OIDC/JWKS discovery
```

> **Local development with Supabase CLI (optional):** For offline development, you can run `supabase start` to spin up a local Supabase stack (PostgreSQL + Auth + Storage on Docker). The local connection string is `Host=127.0.0.1;Port=54322;Database=postgres;Username=postgres;Password=postgres` and the local JWT secret is printed by `supabase status`.

### Production Considerations

- **HTTPS termination** via reverse proxy (nginx, Caddy, Azure Front Door)
- **Connection pooling** via Supabase Supavisor (port 6543, Transaction mode) for production query traffic
- **Secrets** via Azure Key Vault / AWS Secrets Manager / Docker secrets (never in appsettings) — specifically `SUPABASE_DB_PASSWORD` and `SUPABASE_SERVICE_ROLE_KEY` (no JWT secret needed — JWKS discovery is automatic)
- **Database backups** — managed by Supabase (daily automatic backups on Pro plan; point-in-time recovery available)
- **CI/CD** — GitHub Actions: build → test → Docker push → deploy
- **Supabase Storage** — product images served via Supabase CDN; configure bucket policies (public read for product images, authenticated for avatars)

---

## 17. Phase Roadmap

| Phase | Scope | Duration | Dependencies |
|---|---|---|---|
| **1** | Solution setup, domain entities, EF Core → Supabase PostgreSQL, product CRUD + seed data, Swagger | 1 week | Supabase project created |
| **2** | Supabase Auth integration: JWT validation in .NET, Google + Facebook OAuth config in Supabase dashboard, user profile endpoints, auto-provision AppUser | 1 week | Phase 1 |
| **3** | Cart API (add, update, remove, clear, guest merge on login) | 3-4 days | Phase 2 |
| **4** | Order API (create from cart, list, detail, cancel, stock deduction) | 1 week | Phase 3 |
| **5** | Contact form API + email notifications | 2-3 days | Phase 1 |
| **6** | Admin endpoints (product CRUD, order management, dashboard stats, role assignment via Supabase Admin API) | 1 week | Phase 4 |
| **7** | Image upload to Supabase Storage, rate limiting, health checks | 3-4 days | Phase 1 |
| **8** | Integration tests, Docker, CI/CD, staging deployment | 1 week | Phase 6 |
| **9** | Frontend integration (replace mock data with API calls, wire up Supabase Auth in frontend) | 1-2 weeks | Phase 4 |
| **10** | _Future:_ Add caching layer (IMemoryCache / Redis) for product catalog | TBD | Phase 9 |

**Total estimated timeline: 7-8 weeks** (Phase 10 deferred)

---

## Appendix A: NuGet Packages

```xml
<!-- NhanViet.Domain -->
<PackageReference Include="MediatR.Contracts" Version="2.*" />

<!-- NhanViet.Application -->
<PackageReference Include="MediatR" Version="12.*" />
<PackageReference Include="FluentValidation" Version="11.*" />
<PackageReference Include="FluentValidation.DependencyInjectionExtensions" Version="11.*" />

<!-- NhanViet.Infrastructure -->
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.*" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.*" />
<!-- NO Microsoft.AspNetCore.Identity.EntityFrameworkCore — Supabase Auth replaces Identity -->
<PackageReference Include="Serilog.AspNetCore" Version="8.*" />

<!-- NhanViet.Api -->
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.*" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.*" />
<!-- JwtBearer handles OIDC discovery, JWKS fetch, RSA signature verification, and claim population.
     With options.Authority set, it automatically discovers keys — no extra packages needed. -->
<PackageReference Include="AspNetCoreRateLimit" Version="5.*" />

<!-- Test projects -->
<PackageReference Include="xunit" Version="2.*" />
<PackageReference Include="FluentAssertions" Version="6.*" />
<PackageReference Include="Moq" Version="4.*" />
<PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="8.*" />
<PackageReference Include="Testcontainers.PostgreSql" Version="3.*" />
```

> **No Supabase .NET SDK needed.** The only Supabase interactions from .NET are:
> 1. **JWT validation** — handled by `Microsoft.AspNetCore.Authentication.JwtBearer` (already listed)
> 2. **Admin API** calls (set user role, delete user) — plain `HttpClient` with `service_role` key
> 3. **Storage uploads** — plain `HttpClient` POST to `{supabaseUrl}/storage/v1/object/{bucket}/{path}`
>
> There is a community `supabase-csharp` SDK, but for these three use cases, raw `HttpClient` is simpler and avoids an extra dependency.

---

## Appendix B: Configuration Template

```json
// appsettings.json
{
  "ConnectionStrings": {
    "SupabaseDirectConnection": "Host=db.<project-ref>.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=<REPLACE>"
  },
  "Supabase": {
    "Url": "https://<project-ref>.supabase.co",
    "AnonKey": "<REPLACE — public anon key from Supabase dashboard>",
    "ServiceRoleKey": "<REPLACE — secret service_role key, NEVER expose to frontend>",
    "StorageBuckets": {
      "ProductImages": "product-images",
      "Avatars": "avatars"
    }
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173"
    ]
  },
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "noreply@nhanviet.vn",
    "SenderName": "Nhãn Việt"
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft.AspNetCore": "Warning",
        "Microsoft.EntityFrameworkCore": "Warning"
      }
    }
  }
}
```

```json
// appsettings.Development.json (local Supabase CLI — optional)
{
  "ConnectionStrings": {
    "SupabaseDirectConnection": "Host=127.0.0.1;Port=54322;Database=postgres;Username=postgres;Password=postgres"
  },
  "Supabase": {
    "Url": "http://127.0.0.1:54321",
    "AnonKey": "<local anon key from `supabase status`>",
    "ServiceRoleKey": "<local service_role key from `supabase status`>"
  }
}
```

### Supabase Setup Checklist

Before running the .NET API, complete these one-time steps in the Supabase Dashboard:

1. **Create project** at [supabase.com](https://supabase.com) — note the project ref, DB password, and API keys
2. **Auth → Providers → Google** — enable, paste Client ID + Secret from Google Cloud Console
3. **Auth → Providers → Facebook** — enable, paste App ID + Secret from Meta Developer Console
4. **Auth → URL Configuration** — add redirect URLs for your frontend domains
5. **Auth → Email Templates** — customize confirmation/reset emails in Vietnamese
6. **Storage → Create buckets:**
   - `product-images` (public access for product photos)
   - `avatars` (authenticated access for user profile pictures)
7. **Settings → Database** — copy the direct connection string (port 5432)
8. **Verify OIDC discovery works** — open `https://<project-ref>.supabase.co/auth/v1/.well-known/openid-configuration` in a browser and confirm it returns JSON with a `jwks_uri` field

> **No JWT secret needed in appsettings.** The .NET API discovers Supabase's RSA public key automatically via OIDC/JWKS. The `Supabase:ServiceRoleKey` is only used for admin operations (setting user roles, deleting users) — never for JWT validation.
