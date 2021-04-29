# Mongoose Fototeca

Implement the __fototeca__ project, now using the [Mongoose library](https://mongoosejs.com/).

## Iteration 1

Define a [Schema](https://mongoosejs.com/docs/guide.html) in models/images.js file. Create a new model to link this schema to the collecion __images__. Export the model, so the __controller__ is able to use it.

An image is  defined as:

* A title, with a maximum of **10** characters. It is a required field.
* A predominant color, which is an array of integers.
* An URL, which is a required string.
* A Date, which is a Date type

## Iteration 2

Adapt all the controllers so the app works again as expected. You should be able to perform all the basic CRUD operation: Create, Retrieve all images, Update and image, and Delete an image. Start by implementing the Add New Image requirement and List All Images.

Note: You may have to modify the __date__ picker in the view, to another [HTML control](https://developer.mozilla.org/es/docs/Web/HTML/Element/input/datetime) that will generate a UTC date. 

There two options to perform an update or delete to a Mongoose document:
- Option 1: Use a [Model method](https://mongoosejs.com/docs/models.html#updating) to find the document in the collection and update it 
- Option 2: Use a [Document method](https://mongoosejs.com/docs/documents.html#updating-using-save) to retrieve the document, update, and then save it again.

## Iteration 3

Perform [extra validation](https://mongoosejs.com/docs/validation.html#custom-validators) in the Schema model:

* An url must be a valid URL. Perform a validation using a regex expression
* A predominant color must be an array of 3 integers

If any custom validation is not passed, the client should receive a 500 error.

## Bonus Iteration

For each image that successfully is inserted in the database, gather the EXIF information from the URL. You could use this [repo](https://github.com/ianare/exif-samples/tree/master/jpg) to gather the images

1. You should modify your schema with a new property, for example, 'exif-data', of type Object.
2. Retrieve all the available information using a thrid-package library
3. Save this information to the recently created image so the information is stored in database.

[Example](https://oscarm.tinytake.com/tt/NTMzNzIxNV8xNjcwMjg2Mw)


