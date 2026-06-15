# Project Flow & Architecture

## Request Lifecycle
This diagram illustrates how a request travels through the application.

```mermaid
---
config:
  theme: mc
---
graph TD
    Client[Client] -->|HTTP Request| Server[Server index.js]
    
    subgraph Middleware_Layer
        Server --> Security[Security Middleware]
        Security -->|Helmet, CORS, RateLimit, HPP, XSS| Parser[Body Parsers]
        Parser -->|JSON, Cookie| Logger[Logger]
        Logger --> Auth[Auth Middleware]
    end
    
    subgraph Routing_Layer
        Auth -->|Valid Request| Router{Router}
        Router -->|/api/v1/bootcamps| BCR[Bootcamps Route]
        Router -->|/api/v1/courses| CR[Courses Route]
        Router -->|/api/v1/auth| AR[Auth Route]
        Router -->|/api/v1/users| UR[Users Route]
        Router -->|/api/v1/reviews| RR[Reviews Route]
    end
    
    subgraph Controller_Layer
        BCR --> BCC[Bootcamps Controller]
        CR --> CC[Courses Controller]
        AR --> AC[Auth Controller]
        UR --> UC[Users Controller]
        RR --> RC[Reviews Controller]
    end
    
    subgraph Data_Layer
        BCC --> BCM[(Bootcamp Model)]
        CC --> CM[(Course Model)]
        AC --> UM[(User Model)]
        UC --> UM
        RC --> RM[(Review Model)]
    end
    
    Controller_Layer -->|JSON Response| Client
    Data_Layer -->|Data| Controller_Layer
    
    Server -->|Error| ErrorHandler[Error Handler Middleware]
    ErrorHandler -->|Error Response| Client
```

## Data Models (ERD)
Relationships between the main data entities.

```mermaid
erDiagram
    User ||--o{ Bootcamp : "publishes"
    User ||--o{ Review : "writes"
    Bootcamp ||--o{ Course : "offers"
    Bootcamp ||--o{ Review : "receives"
    
    User {
        string name
        string email
        string role "user|publisher"
        string password
    }
    
    Bootcamp {
        string name
        string description
        string website
        string phone
        string email
        string address
        string[] careers
        boolean housing
        boolean jobAssistance
        boolean jobGuarantee
        boolean acceptGi
    }
    
    Course {
        string title
        string description
        string weeks
        string tuition
        string minimumSkill
        boolean scholarshipAvailable
    }
    
    Review {
        string title
        string text
        number rating
    }
```

## Key Components

### Middleware
- **Security**: `helmet`, `cors`, `express-rate-limit`, `hpp`, `xss-clean` protect the app.
- **Auth**: `protect` verifies JWT tokens, `authorize` checks user roles.
- **Advanced Results**: Handles pagination, filtering, and sorting for list endpoints.
- **Error Handler**: Centralized error handling for consistent responses.

### Controllers
- **Auth**: Registration, login, logout, password management.
- **Bootcamps**: CRUD operations for bootcamps, photo upload, geospatial search.
- **Courses**: CRUD operations for courses, associated with bootcamps.
- **Users**: Admin management of users.
- **Reviews**: User reviews for bootcamps.

### Models
- **User**: Stores user information, authentication, and roles.
- **Bootcamp**: Stores bootcamp details, location, and associated courses.
- **Course**: Stores course details, associated with bootcamps.
- **Review**: Stores user reviews for bootcamps.

