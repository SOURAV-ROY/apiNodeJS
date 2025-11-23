# API Reference

Backend API for the DevCamper application to the manage bootcams

## Indices

* [AUTH](#auth)

  * [Forgot Password](#1-forgot-password)
  * [Get Logged In User Via Token](#2-get-logged-in-user-via-token)
  * [Login User](#3-login-user)
  * [Logout User](#4-logout-user)
  * [Register User](#5-register-user)
  * [Reset Password](#6-reset-password)
  * [Update User Details](#7-update-user-details)
  * [Update User Password](#8-update-user-password)

* [Bootcamps](#bootcamps)

  * [Create New Bootcamp](#1-create-new-bootcamp)
  * [Delete Bootcamp](#2-delete-bootcamp)
  * [Get All Bootcamps](#3-get-all-bootcamps)
  * [Get Bootcamps In Radius](#4-get-bootcamps-in-radius)
  * [Get Single Bootcamp](#5-get-single-bootcamp)
  * [Pagination Bootcamps](#6-pagination-bootcamps)
  * [Photo Upload For Bootcamp](#7-photo-upload-for-bootcamp)
  * [Req Query Search](#8-req-query-search)
  * [Select And Sort](#9-select-and-sort)
  * [Update Bootcamp](#10-update-bootcamp)

* [Courses](#courses)

  * [Create Bootcamp Course](#1-create-bootcamp-course)
  * [Create Course Under Bootcamp](#2-create-course-under-bootcamp)
  * [Delete Course](#3-delete-course)
  * [Get A Single Course](#4-get-a-single-course)
  * [Get All Courses](#5-get-all-courses)
  * [Get All Courses For Bootcamp](#6-get-all-courses-for-bootcamp)
  * [Update Course](#7-update-course)

* [Reviews](#reviews)

  * [Add One Review On One Bootcamp](#1-add-one-review-on-one-bootcamp)
  * [Delete Review](#2-delete-review)
  * [Get A Single Review](#3-get-a-single-review)
  * [Get All Reviews](#4-get-all-reviews)
  * [Get All Reviews By One Bootcamp](#5-get-all-reviews-by-one-bootcamp)
  * [Update Review](#6-update-review)

* [Users](#users)

  * [Create New User](#1-create-new-user)
  * [Delete User](#2-delete-user)
  * [Get All Users](#3-get-all-users)
  * [Get Single User](#4-get-single-user)
  * [Update User](#5-update-user)


--------


## AUTH



### 1. Forgot Password



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/forgotpassword
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```jsonon        
{

    "email": "admin@gmail.com"
}
```



### 2. Get Logged In User Via Token



***Endpoint:***

```bash
Method: GET
Type: 
URL: {{URL}}/api/v1/auth/me
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



### 3. Login User



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/login
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```jsonon        
{
    "email": "admin@gmail.com",
    "password": "123456"
}
```



### 4. Logout User



***Endpoint:***

```bash
Method: GET
Type: 
URL: {{URL}}/api/v1/auth/logout
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



### 5. Register User



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/register
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```jsonon        
{
    "name": "Review3",
		"email": "review3@gmail.com",
        "role":"user",
		"password": "123456"
}
```



### 6. Reset Password



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/resetpassword/8c7b3dc3892fd8335b9ac57ec4639fc2d1a90fd9
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{

    "password": "123456"
}
```



### 7. Update User Details



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/updatedetails
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "name": "Admin 2 Update",
		"email": "admin2@gmail.com"
}
```



### 8. Update User Password



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/updatepassword
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "currentPassword":"123456",
    "newPassword":"1234567"
}
```

## Bootcamps
Bootcamps CRUD functionality



### 1. Create New Bootcamp


Create New Bootcamp Must be Authenticate By Admin or publishers


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/bootcamps/
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |
| Authorization | Sourav eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZmQyY2NmNzY0NzlmMjQ5MDc2NDBjMCIsIm5hbWUiOiJVc2VyIEFjY291bnQiLCJpYXQiOjE2MTA0Mjg5NDAsImV4cCI6MTYxMzAyMDk0MH0.X-Zws9YZiW5f4NKh5_P4HZKiplLSrh4uSuf8TK8nUv4 |  |



***Body:***

```json        
{
    "name": "ModernTech Bootcamp XSS-CLEAN<script>alert(1)</script>",
		"description": "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in front end and full stack web development",
		"website": "https://devcentral.com",
		"phone": "(444) 444-4444",
		"email": "enroll@devcentral.com",
		"address":"Nikunja-2 Dhaka, Dhaka Division 1229, BD",
		"careers": [
			"Mobile Development",
			"Web Development",
			"Data Science",
			"Business"
		],
		"housing": false,
		"jobAssistance": true,
		"jobGuarantee": true,
		"acceptGi": true
}
```



### 2. Delete Bootcamp


Delete Bootcamp By ID From DB


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{URL}}/api/v1/bootcamps/6005e12bad4a0a3278ecc8f8
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



### 3. Get All Bootcamps


Fetch all bootcamps from database


***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/bootcamps/
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{}
```



### 4. Get Bootcamps In Radius



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/bootcamps/radius/02215/10
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{}
```



### 5. Get Single Bootcamp


Get Single Bootcamp By ID


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{URL}}/api/v1/bootcamps/5d713a66ec8f2b88b8f830b8
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



### 6. Pagination Bootcamps



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/bootcamps/
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| page | 2 |  |
| limit | 1 |  |
| select | name |  |



***Body:***

```json        
{}
```



### 7. Photo Upload For Bootcamp



***Endpoint:***

```bash
Method: PUT
Type: FORMDATA
URL: {{URL}}/api/v1/bootcamps/5d725a1b7b292f5f8ceff788/photo
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

| Key | Value | Description |
| --- | ------|-------------|
| file |  |  |



### 8. Req Query Search



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/bootcamps/
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| housing | true |  |
| location.state | MA |  |



***Body:***

```json        
{}
```



### 9. Select And Sort



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/bootcamps/
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| select | name,slug,housing,createdAt |  |
| sort | name |  |



***Body:***

```json        
{}
```



### 10. Update Bootcamp


Update Bootcamp By ID from database


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/bootcamps/5ffe9125e8854807e8960828
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "housing": false
}
```



## Courses
CRUD All Courses !!!



### 1. Create Bootcamp Course


Create a course for specific bootcamp


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/bootcamps/5ffea33f8c3f0a2f3853d00b/courses
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "title": "UI/UX By ADMIN",
		"description": "In this course you will learn to create beautiful interfaces. It is a mix of design and development to create modern user experiences on both web and mobile",
		"weeks": 12,
		"tuition": 10000,
		"minimumSkill": "intermediate",
		"scholarhipsAvailable": true
}
```



### 2. Create Course Under Bootcamp



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/bootcamps/5d713a66ec8f2b88b8f830b8/courses
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "title": "UI/UX By SOURAV Update 2",
		"description": "In this course you will learn to create beautiful interfaces. It is a mix of design and development to create modern user experiences on both web and mobile",
		"weeks": 12,
		"tuition": 10000,
		"minimumSkill": "intermediate",
		"scholarhipsAvailable": true
}
```



### 3. Delete Course



***Endpoint:***

```bash
Method: DELETE
Type: RAW
URL: {{URL}}/api/v1/courses/5ffea3948c3f0a2f3853d00c
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "tuition": 12000,
    "minimumSkill": "advanced"
}
```



### 4. Get A Single Course



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/courses/5d725a4a7b292f5f8ceff789
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{}
```



### 5. Get All Courses



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/courses/
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{}
```



### 6. Get All Courses For Bootcamp



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/bootcamps/5d713a66ec8f2b88b8f830b8/courses
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{}
```



### 7. Update Course



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/courses/5ffea3948c3f0a2f3853d00c
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "tuition": 12000,
    "minimumSkill": "advanced"
}
```



## Reviews



### 1. Add One Review On One Bootcamp



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/bootcamps/60054405d6a84136343e2ad8/reviews
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "title":"Review 1",
    "text":"This is the description",
    "rating": 8
}
```



### 2. Delete Review



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{URL}}/api/v1/reviews/600547069b7d8a31a0d9c3d3
```



### 3. Get A Single Review



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/reviews/5d7a514b5d2c12c7449be020
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "title":"Update Review Title",
    "rating":7
}
```



### 4. Get All Reviews



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/reviews
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{}
```



### 5. Get All Reviews By One Bootcamp



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/bootcamps/60054405d6a84136343e2ad8/reviews
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "title":"Best Review Title 2",
    "text":"This is the description",
    "rating": 8
}
```



### 6. Update Review



***Endpoint:***

```bash
Method: PUT
Type: 
URL: {{URL}}/api/v1/reviews/6005381b224bfa27389ddc0c
```



## Users



### 1. Create New User



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/users/
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "name":"SOURAV ROY NEW USER",
    "email":"sourav@gmail.com",
    "password":"123456"
}
```



### 2. Delete User



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{URL}}/api/v1/users/6001587dc501af1178b073ae
```



### 3. Get All Users



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/users/
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{}
```



### 4. Get Single User



***Endpoint:***

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/users/600543b6d6a84136343e2ad6
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{}
```



### 5. Update User



***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/users/6001587dc501af1178b073ae
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON TYPE |



***Body:***

```json        
{
    "name":"SOURAV ROY NEW UPDATE"
}
```
