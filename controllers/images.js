const ImageGallery = require('../models/images');

const get_image_colors = require('get-image-colors');

// helper function to extract the predominant color from a given structure
function extractPredominantColor(colors) {
    let firstColor = colors[0];
    return firstColor._rgb.slice(0, -1);
}

exports.deleteImage = async (req, res) => {
    // recuperamos el id de la ruta dinámica
    const idImage = req.params.idImage;

    // 1. Recupero una instancia de la imagen identificada por idImage
    const image = await ImageGallery.findImageById(idImage)

    // 2. Aplico el método delete después de construir la imagen
    await image.delete()

    // redirigimos al cliente a la lista de imagenes
    res.redirect('/')
}

exports.updateImage = async (req, res) => {
    // renderizar la vista del formulario. Rellenar los campos del formulario con la información de la imagen que queremos actualizar. Ofrecer dos botones: Actualizar, Borrar.
    
    let idImage = req.params.idImage;
    let image = await ImageGallery.findImageById(idImage)

    if (!image) {
        throw new Error('Image not found in server')
    }

    res.render('addNew', {
        error: false,
        path: '/add-new',
        image: image

    });
    // El botón de 'Enviar' del formulario pasará a ser 'Actualizar'. Tenemos que modificar el atributo 'action' del tag <form> para ofrecer un endpoint distino para actualizar la imagen. Alternativamente, podiamos usar el mismo endpoint, y que sea el controlar que se encargue de verificar si la imagen ya está en nuestra base de datos y lo que queramos en realidad sea actualizarla.
}

exports.getImages = (req, res, next) => {
    ImageGallery.findAll().then( allImages => {
        console.log('In the controller: ' , allImages)
        res.render('images', {
            images: allImages,
            path: '/'
        });
    })
};

exports.addImage = (req, res, next) => {
    res.render('addNew', {
        error: false,
        path: '/add-new',
        image: null

    });
};

exports.addImagePost = async (req, res) => {
    const imageUrl = req.body.imageURL;
    const title = req.body.imageName;
    const date = req.body.date;
    const predominantColor = req.body.predominantColor
    const id = req.body.id

    if (id) {
        const newImage = 
        new ImageGallery(title, imageUrl, predominantColor.split(','), date, id);
        await newImage.update()
        return res.redirect('/')
    }

    if (await ImageGallery.checkIfImageExists(imageUrl)) {
        // res.render NO Termina la ejecucióndel JavaScript; tan solo devuelve información al cliente. 
        // Necesitamos la palabra 'return' para terminar de manera inmediata la ejecución del código
        return res.render('addNew', {
            error: `La URL ${imageUrl} ya existe en nuestra base de datos.`,
            path: '/add-new',
            image: null

        });
    }
    
    // La imagen NO existe en la base datos
    get_image_colors(imageUrl).then( async (colors) => {
        // solo en este punto del código tenemos toda la información necesaria para crear la foto.

        const predominantColor = extractPredominantColor(colors);

        const newImage = new ImageGallery(title, imageUrl, predominantColor, date);

        // Debemos substituir la siguiente instrucción por newImage.save()

        await newImage.save()

        return res.redirect('/');
    }).catch(error => {
        // Ahora tenemos un console.log; pero en el futuro
        // seria interesante guardar los errores en un fichero
        console.log("Error de conversión", error);
        return res.render('addNew', {
            error: `Ha ocurrido un error inesperado al subir la foto. Por favor, prueba con otra URL`,
            path: '/add-new',
            image: null

        });
    })
};