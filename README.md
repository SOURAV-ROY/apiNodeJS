# NodeJs API Create #

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
