# NodeJs API Create #

### Bootcamps
- List all bootcamps in the database
   * Pagination
   * Select specific fields in result
   * Limit number of results
   * Filter by fields
- Search bootcamps by radius from zipcode
  * Use a geocoder to get exact location and coords from a single address field
- Get single bootcamp
- Create new bootcamp
  * Authenticated users only
  * Must have the role "publisher" or "admin"
  * Only one bootcamp per publisher (admins can create more)
  * Field validation via Mongoose
- Upload a photo for bootcamp
  * Owner only
  * Photo will be uploaded to local filesystem
- Update bootcamps
  * Owner only
  * Validation on update
- Delete Bootcamp
  * Owner only
- Calculate the average cost of all courses for a bootcamp
- Calculate the average rating from the reviews for a bootcamp

### Courses
- List all courses for bootcamp
- List all courses in general
  * Pagination, filtering, etc
- Get single course
- Create new course
  * Authenticated users only
  * Must have the role "publisher" or "admin"
  * Only the owner or an admin can create a course for a bootcamp
  * Publishers can create multiple courses
- Update course
  * Owner only
- Delete course
  * Owner only
  
### Reviews
- List all reviews for a bootcamp
- List all reviews in general
  * Pagination, filtering, etc
- Get a single review
- Create a review
  * Authenticated users only
  * Must have the role "user" or "admin" (no publishers)
- Update review
  * Must have the role "user" or "admin" (no publishers)
- Delete review
  * Must have the role "user" or "admin" (no publishers)

### Users & Authentication
- Authentication will be ton using JWT/cookies
  * JWT and cookie should expire in 30 days
- User registration
  * Register as a "user" or "publisher"
  * Once registered, a token will be sent along with a cookie (token = xxx)
  * Passwords must be hashed
- User login
  * User can login with email and password
  * Plain text password will compare with stored hashed password
  * Once logged in, a token will be sent along with a cookie (token = xxx)
- User logout
  * Cookie will be sent to set token = none
- Get user
  * Route to get the currently logged in user (via token)
- Password reset (lost password)
  * User can request to reset password
  * A hashed token will be emailed to the users registered email address
  * A put request can be made to the generated url to reset password
  * The token will expire after 10 minutes
- Update user info
  * Authenticated user only
  * Separate route to update password
- User CRUD
  * Admin only
- Users can only be made admin by updating the database field manually

## Security
- Encrypt passwords and reset tokens
- Prevent NoSQL injections
- Add headers for security (helmet)
- Prevent cross site scripting - XSS
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param polution
- Use cors to make API public (for now)

## Documentation
- Use Postman to create documentation
- Use docgen to create HTML files from Postman
- Add html files as the / route for the api




## Reverse Populate
### In Model (Options)
```js
toJSON: {virtuals: true},
toObject: {virtuals: true}
```
```js
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
});
```
### In Controller
```js
query = Bootcamp.find(JSON.parse(queryString)).populate('courses');
```
## Course Being Removed From Bootcamp
```js
BootcampSchema.pre('remove', async function (next) {
    console.log(`Course being removed from bootcamp: ${this._id}`);
    await this.model('Course').deleteMany({bootcamp: this._id});
    next();
})
```
```js
const bootcamp = await Bootcamp.findById(req.params.id);
bootcamp.remove();
```
## Calculating The Average CourseCost
```js
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: {$avg: '$tuition'}
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        })
    } catch (errors) {
        console.log(errors);
    }
}
```
```js
//Call AverageCost After Add Course **********************
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

//Call AverageCost Before Remove Course ******************
CourseSchema.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp);
});
```
## Encrypt Password Using bcryptjs ##
```js
UserSchema.pre('save', async function (next) {
   if (!this.isModified('password')) {
          next();
      }
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
});
```
## get Signed JWT ##
```js
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
```
## Match User Entered Password to Hashed Password ##
```js
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
```
## Grand Access to Specific Roles ##
```js
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User Role ${req.user.role} is Not Authorize to access this route`, 403));
        }
        next();
    };
};
```
## Bootcamp User Relationship ##
```js
  req.body.user = req.user.id;
  
  const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});
  
  if (publishedBootcamp && req.user.role !== 'admin') {
      return next(new ErrorResponse(`The User with ${req.user.id} Already Published a Bootcamp`, 400));
  }
```
## Make Sure User Is Bootcamp Owner ##
```js
if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} Is Not Authorized to The Bootcamp`, 401));
}
```
## Generate And Hash Password Token ##
```js
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
        
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
```
## Prevent User From Submitting More Than 1 Review Per Bootcamp ##
```js
ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true});
```

# apiNodeJS

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



---
