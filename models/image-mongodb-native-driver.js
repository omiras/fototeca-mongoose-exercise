const database = require('../util/database')

exports.ImageGallery = class ImageGallery {
  constructor(title, url, color, date, id) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.predominantColor = color;
    this.date = date;
  }

  static async findAll() {
    // Recuperar todos los registros de la base de datos de MongoDB
    const images = database.getDB().collection('images')

    // Utilizamos el método del cursor 'sort' para ordenar los documentos obtenidos de forma decreciemnte por el campo "date"
    // https://mongodb.github.io/node-mongodb-native/3.6/api/Cursor.html
    
    const cursor = images.find({}).sort("date", -1);
    const allImages = await cursor.toArray();

    // TODO: Tenemos que crear tantas instancias de clase como documentos obtenemos de la consulta. Dicho de otro modo, hay que recorrer el array allImages y crear otro array diferente con tantas instancias de la clase ImageGallery como documentos recuperados

    //console.log('Before mapping: ', allImages)

    return allImages.map(image => {
      return new ImageGallery(image.title, image.url, image.predominantColor, image.date, image._id)
    })

  }
  async update() {

    const images = database.getDB().collection('images')
    
    const filter = { "_id": database.ObjectId(this.id) }

    const updateImage = {
      $set: {
        title: this.title,
        date: this.date
      },
    }

    const result = await images.updateOne(filter, updateImage)

    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );
  }

  /**
   * Guardar en base de datos la imagen
   */
  async save() {
    console.log("Los datos que guardo: " + this)

    const images = database.getDB().collection('images')

    // 1. Úsar un método de MongoDB para insertar la imagen contenida en 'this' (este objeto) en la base de datos https://docs.mongodb.com/drivers/node/usage-examples/insertOne/

    // Importante: no es necesario que paseis el identificador. Decidimos que sea MongoDB quien lo genere. Tenemos que actualizar el campo this.id con el valor que obtenemos de la instrucción insertOne

    const imageToSave = {
      title: this.title,
      url: this.url,
      predominantColor: this.predominantColor,
      date: this.date
    }

    const result = await images.insertOne(imageToSave)
    this.id = result.insertedId

    console.log("Id del documento insertado: ", this.id)

    // TODO: Para la funcionalidad 'update image'. Este método debe comprobar si el objeto ya tiene informada la propiedad 'this.id'. En tal caso, debemos realizar un 'updateOne' https://docs.mongodb.com/drivers/node/usage-examples/updateOne/ en vez de insertar el registro
  }

  async delete() {
    const images = database.getDB().collection('images')

    // 1. Borra el documento de la colección identificado por 'this.id' 
    const query = { "_id": database.ObjectId(this.id) }

    const result = await images.deleteOne(query);

    if (result.deletedCount === 1) {
      console.dir("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
  }

  static async checkIfImageExists(url) {
    const images = database.getDB().collection('images')

    // 1. Podríamos hacer un find en la colección. Si el Count es 0; es que dicha imagen no existe. Esta función debería devolver un boleano
    // Alternativamente, findOne devuelve null si no encuentra el documento 

    // En ES6 puedes indicar que quieres crear un objeto usando una variable como nombre de campo y valir a la vez

    // Es equivalente a : const query = { url: url }
    const query = { url }

    const image = await images.findOne(query)
    console.log('imagen recuperada de la BBDD: ', image)
    return image

  }

  static async findImageById(id) {
    const images = database.getDB().collection('images')

    // 1. Recuperar el documento de la colección 'images' cuyo 'id' sea exactamente el que le pasamos por parámetro https://docs.mongodb.com/drivers/node/usage-examples/findOne/

    const query = { "_id": database.ObjectId(id) }

    // 2. Con los datos recuperados, debemos crear una instancia de la clase ImageGallery y devolverla al controlador. Alternativamente, podríamos devolver el objeto tal cual, pero entonces sería el controlador quien deberia crear una instancia de esta clase
    const image = await images.findOne(query)
    console.log('imagen recuperada de la BBDD findById: ', image)

    return new ImageGallery(image.title, image.url, image.predominantColor, image.date, image._id)
  }

}