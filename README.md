# NestJS Request/Response Flow - Hướng dẫn chi tiết

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Quy trình xử lý Request/Response](#quy-trình-xử-lý-requestresponse)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt](#cài-đặt)
- [Chi tiết từng thành phần](#chi-tiết-từng-thành-phần)
- [Ví dụ sử dụng API](#ví-dụ-sử-dụng-api)
- [Flow diagram chi tiết](#flow-diagram-chi-tiết)

## 🎯 Tổng quan

Dự án này minh họa quy trình đầy đủ của một HTTP request đi qua các layer trong NestJS, từ khi nhận request cho đến khi trả về response.

## 🔄 Quy trình xử lý Request/Response

### **REQUEST FLOW** (Client → Server)

```
┌─────────────────────────────────────────────────────────────┐
│  1. CLIENT GỬI REQUEST                                      │
│     GET /users/1                                            │
│     Headers: Authorization: Bearer valid-token-123          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. MIDDLEWARE LAYER                                        │
│     ├─ LoggerMiddleware                                     │
│     │  • Ghi log request: method, URL                       │
│     │  • Bắt đầu đếm thời gian xử lý                        │
│     │  • Gọi next() để chuyển sang layer tiếp theo          │
│     └─ Output: Log "[GET] /users/1"                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. GUARDS LAYER (Authentication & Authorization)           │
│     ├─ AuthGuard                                            │
│     │  • Kiểm tra header Authorization                      │
│     │  • Validate token                                     │
│     │  • Nếu hợp lệ: gắn user vào request.user             │
│     │  • Nếu không: throw UnauthorizedException             │
│     │                                                        │
│     └─ RolesGuard (nếu có)                                  │
│        • Kiểm tra quyền của user                            │
│        • So sánh với @Roles() decorator                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. INTERCEPTORS LAYER (Pre-processing)                     │
│     ├─ LoggingInterceptor                                   │
│     │  • Log "→ Before Controller"                          │
│     │  • Ghi nhận thời gian bắt đầu                         │
│     │  • Chuẩn bị theo dõi response                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. PIPES LAYER (Validation & Transformation)               │
│     ├─ ParseIntPipe                                         │
│     │  • Transform param 'id' từ string → number            │
│     │  • Validate: phải là số nguyên hợp lệ                 │
│     │  • Nếu không hợp lệ: throw BadRequestException        │
│     │                                                        │
│     └─ ValidationPipe                                       │
│        • Validate DTO theo class-validator decorators       │
│        • Check: @IsString(), @IsEmail(), @MinLength()       │
│        • Transform data types nếu cần                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  6. CONTROLLER LAYER                                        │
│     @Controller('users')                                    │
│     class UserController {                                  │
│       @Get(':id')                                           │
│       async findOne(@Param('id') id: number) {              │
│         • Nhận parameter đã được validate                   │
│         • Gọi service để xử lý logic                        │
│         return this.userService.findOne(id);                │
│       }                                                     │
│     }                                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  7. SERVICE LAYER (Business Logic)                          │
│     class UserService {                                     │
│       async findOne(id: number) {                           │
│         • Tìm user trong database/array                     │
│         • Nếu không tìm thấy: throw NotFoundException       │
│         • Xử lý business logic                              │
│         • Return data                                       │
│       }                                                     │
│     }                                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  DATABASE/REPOSITORY                                        │
│     • Query database                                        │
│     • Return raw data                                       │
└─────────────────────────────────────────────────────────────┘
```

### **RESPONSE FLOW** (Server → Client)

```
┌─────────────────────────────────────────────────────────────┐
│  DATABASE/REPOSITORY                                        │
│     • Trả data về Service                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  SERVICE LAYER                                              │
│     • Nhận data từ database                                 │
│     • Xử lý business logic (nếu cần)                        │
│     • Return data về Controller                             │
│     Data: { id: 1, name: "John", email: "..." }            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CONTROLLER LAYER                                           │
│     • Nhận data từ Service                                  │
│     • Return về cho NestJS framework xử lý tiếp             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  INTERCEPTORS LAYER (Post-processing)                       │
│     ├─ LoggingInterceptor                                   │
│     │  • Log "← After Controller: Xms"                      │
│     │  • Tính thời gian xử lý                               │
│     │                                                        │
│     └─ TransformInterceptor                                 │
│        • Transform response thành format chuẩn:             │
│          {                                                  │
│            "success": true,                                 │
│            "data": { ... },                                 │
│            "timestamp": "2024-01-01T12:00:00Z"              │
│          }                                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  EXCEPTION FILTERS (nếu có lỗi xảy ra)                     │
│     HttpExceptionFilter / AllExceptionsFilter               │
│     • Bắt tất cả exceptions                                 │
│     • Format error response:                                │
│       {                                                     │
│         "success": false,                                   │
│         "statusCode": 404,                                  │
│         "message": "User không tồn tại",                    │
│         "timestamp": "..."                                  │
│       }                                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  MIDDLEWARE (Response)                                      │
│     • Ghi log tổng thời gian xử lý                          │
│     • Log: "[GET] /users/1 200 - 45ms"                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CLIENT NHẬN RESPONSE                                       │
│     Status: 200 OK                                          │
│     Body: {                                                 │
│       "success": true,                                      │
│       "data": { "id": 1, "name": "John", ... },            │
│       "timestamp": "2024-01-01T12:00:00Z"                   │
│     }                                                       │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Cấu trúc dự án

```
src/
├── main.ts                      # Bootstrap application
├── app.module.ts                # Root module
│
├── users/
│   ├── user.module.ts           # User module
│   ├── user.controller.ts       # Controller - Route handlers
│   ├── user.service.ts          # Service - Business logic
│   ├── user.entity.ts           # Entity/Model
│   ├── user.dto.ts              # DTOs - Data Transfer Objects
│   │
│   ├── middleware/
│   │   └── logger.middleware.ts # Middleware - Logging
│   │
│   ├── guards/
│   │   ├── auth.guard.ts        # Guard - Authentication
│   │   └── roles.guard.ts       # Guard - Authorization
│   │
│   ├── interceptors/
│   │   ├── logging.interceptor.ts    # Interceptor - Logging
│   │   └── transform.interceptor.ts  # Interceptor - Transform response
│   │
│   ├── pipes/
│   │   └── parse-int.pipe.ts    # Pipe - Custom validation
│   │
│   └── filters/
│       ├── http-exception.filter.ts    # Filter - HTTP errors
│       └── all-exceptions.filter.ts    # Filter - All errors
```

## 🚀 Cài đặt

### Yêu cầu
- Node.js >= 16
- npm hoặc yarn

### Các bước cài đặt

```bash
# 1. Clone hoặc tạo project mới
nest new nestjs-request-flow

# 2. Cài đặt dependencies
npm install class-validator class-transformer

# 3. Copy tất cả code từ ví dụ vào các file tương ứng

# 4. Chạy application
npm run start:dev

# 5. Server sẽ chạy tại
http://localhost:3000
```

## 📝 Chi tiết từng thành phần

### 1. **DTO (Data Transfer Object)**

```typescript
// user.dto.ts
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

**Mục đích:** Validate và define cấu trúc data từ client

---

### 2. **Middleware**

```typescript
// logger.middleware.ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next(); // Chuyển sang layer tiếp theo
  }
}
```

**Mục đích:** Xử lý request trước khi đến route handler (logging, cors, body parsing...)

---

### 3. **Guards**

```typescript
// auth.guard.ts
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    
    if (!token) {
      throw new UnauthorizedException();
    }
    
    return true; // Cho phép request tiếp tục
  }
}
```

**Mục đích:** Kiểm tra authentication/authorization

---

### 4. **Interceptors**

```typescript
// transform.interceptor.ts
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

**Mục đích:** Transform request/response, logging, caching

---

### 5. **Pipes**

```typescript
// parse-int.pipe.ts
@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('ID phải là số');
    }
    return val;
  }
}
```

**Mục đích:** Validate và transform data

---

### 6. **Exception Filters**

```typescript
// http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    
    response.status(status).json({
      success: false,
      statusCode: status,
      message: exception.message,
    });
  }
}
```

**Mục đích:** Bắt và xử lý errors, format error response

---

### 7. **Controller**

```typescript
// user.controller.ts
@Controller('users')
@UseGuards(AuthGuard)
@UseInterceptors(TransformInterceptor)
export class UserController {
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }
}
```

**Mục đích:** Define routes và handle HTTP requests

---

### 8. **Service**

```typescript
// user.service.ts
@Injectable()
export class UserService {
  async findOne(id: number): Promise<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    return user;
  }
}
```

**Mục đích:** Chứa business logic, tương tác với database

---

## 🧪 Ví dụ sử dụng API

### 1. **GET - Lấy tất cả users**

```bash
curl -H "Authorization: Bearer valid-token-123" \
     http://localhost:3000/users
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 2. **GET - Lấy user theo ID**

```bash
curl -H "Authorization: Bearer valid-token-123" \
     http://localhost:3000/users/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 3. **POST - Tạo user mới**

```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer valid-token-123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 4. **PUT - Cập nhật user**

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Authorization: Bearer valid-token-123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated"
  }'
```

---

### 5. **DELETE - Xóa user**

```bash
curl -X DELETE http://localhost:3000/users/1 \
  -H "Authorization: Bearer valid-token-123"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User đã được xóa thành công"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 6. **Ví dụ Error Response**

**Request không có token:**
```bash
curl http://localhost:3000/users/1
```

**Response:**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "No token provided",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Request với ID không hợp lệ:**
```bash
curl -H "Authorization: Bearer valid-token-123" \
     http://localhost:3000/users/abc
```

**Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "ID phải là số nguyên",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**User không tồn tại:**
```bash
curl -H "Authorization: Bearer valid-token-123" \
     http://localhost:3000/users/999
```

**Response:**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User với ID 999 không tồn tại",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🔍 Flow diagram chi tiết

### **Success Flow (Request thành công)**

```
Client → Middleware → Guards → Interceptors(pre) → Pipes 
  → Controller → Service → Repository/Database
  → Service → Controller → Interceptors(post) 
  → Response Transform → Client
```

### **Error Flow (Request bị lỗi)**

```
Client → Middleware → Guards (❌ Fail)
  → Exception Filter → Error Response → Client

Client → Middleware → Guards → Pipes (❌ Fail)
  → Exception Filter → Error Response → Client

Client → ... → Service (❌ Throw Exception)
  → Exception Filter → Error Response → Client
```

---

## 📊 Console Logs khi chạy

Khi gọi API `GET /users/1`, console sẽ hiển thị:

```
[2024-01-01T12:00:00.000Z] GET /users/1 - Start
→ Before Controller: GET /users/1
← After Controller: 15ms
[2024-01-01T12:00:00.000Z] GET /users/1 200 - 45ms
```

---

## 🎯 Các điểm quan trọng cần nhớ

1. **Thứ tự execution:** Middleware → Guards → Interceptors → Pipes → Controller
2. **Guards** quyết định request có được phép tiếp tục hay không
3. **Pipes** validate và transform data trước khi vào controller
4. **Interceptors** có thể xử lý cả trước và sau controller
5. **Exception Filters** bắt tất cả errors và format response
6. **Service** chứa business logic, không nên để logic trong controller
7. **DTO** dùng để validate input data với class-validator

---

## 🔧 Customization

Bạn có thể customize các thành phần:

- Thêm database thật (TypeORM, Prisma, Mongoose)
- Implement JWT authentication thật
- Thêm rate limiting
- Thêm caching với Redis
- Implement logging với Winston
- Thêm Swagger documentation
- Unit testing với Jest

---

## 📚 Tài liệu tham khảo

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Middleware](https://docs.nestjs.com/middleware)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Interceptors](https://docs.nestjs.com/interceptors)
- [NestJS Pipes](https://docs.nestjs.com/pipes)
- [NestJS Exception Filters](https://docs.nestjs.com/exception-filters)

---

## 📄 License

MIT

---

## 👨‍💻 Author

Created with ❤️ for learning NestJS