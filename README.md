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
### Course Being Removed From Bootcamp
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
