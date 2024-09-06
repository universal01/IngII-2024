const {Router} = require('express');
const Media = require ('../models/Media.js');
const {validationResult, check} = require('express-validator');
const { resolveObjectURL } = require('buffer');

const router = Router();

//Metodo Obtener

router.get('/', async function(req, res){
    try{
        const media = await Media.find().populate([
            {
                path:'director', select: 'nombre estado'
            },
            {
                path:'genero', select: 'nombre estado'
            },
            {
                path: 'productora', select: 'nombre estado'
            },
            {
                path: 'tipo', select: 'nombre descripcion'
            }
        ]);
        res.status(200).json(media);
    } catch(error){
        console.log('Error al obtener Media', error);
        res.status(500).send('ocuarrio un error')
    }
});

//Metodo crear

router.post('/',[
    check('serial', 'Nombre es requerido').not().isEmpty(),
    check('titulo', 'Nombre es requerido').not().isEmpty(),
    check('sipnosis', 'Nombre es requerido').not().isEmpty(),
    check('url', 'Nombre es requerido').not().isEmpty(),
    check('genero', 'Genero es requerido').not().isEmpty(),
    check('director', 'Director es requerido').not().isEmpty(),
    check('productora', 'Productora es requerido').not().isEmpty(),
    check('tipo', 'Tipo es requerido').not().isEmpty(),


], async function(req, res) {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array()})
        }

        const existeMediaPorSerial = await Media.findOne({serial: req.body.serial});
        if(existeMediaPorSerial){
            return res.status(400).send("Ya existe este serial");
        }

        let media = new Media();
        media.serial = req.body.serial;
        media.titulo = req.body.titulo;
        media.sipnosis = req.body.sipnosis;
        media.url = req.body.url;
        media.genero = req.body.genero._id;
        media.director = req.body.director._id;
        media.productora = req.body.productora._id;
        media.tipo = req.body.tipo._id;
        media.fechaCreacion = new Date();
        media.fechaActualizacion = new Date();

        
        media = await media.save();
        res.send(media);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al crear Media')
    }
    
});

//Metodo actualizar

router.put('/:inventarioId',[
    check('serial', 'Nombre es requerido').not().isEmpty(),
    check('titulo', 'Nombre es requerido').not().isEmpty(),
    check('sipnosis', 'Nombre es requerido').not().isEmpty(),
    check('url', 'Nombre es requerido').not().isEmpty(),
    check('genero', 'Genero es requerido').not().isEmpty(),
    check('director', 'Director es requerido').not().isEmpty(),
    check('productora', 'Productora es requerido').not().isEmpty(),
    check('tipo', 'Tipo es requerido').not().isEmpty(),


], async function(req, res) {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array()})

        }

        let media =await Media.findById(req.params.media);
        if(!media){
            return res.status(400).send('Media no existe')
        }

        const existeMediaPorSerial = await Media.findOne({serial: req.body.serial});
        if(existeMediaPorSerial){
            return res.status(400).send("Ya existe este serial");
        }

        media.serial = req.body.serial;
        media.titulo = req.body.titulo;
        media.sipnosis = req.body.sipnosis;
        media.url = req.body.url;
        media.genero = req.body.genero._id;
        media.director = req.body.director._id;
        media.productora = req.body.productora._id;
        media.tipo = req.body.tipo._id;
        media.fechaActualizacion = new Date();

        
        media = await media.save();
        res.send(media);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al actualizar Media')
    }
    
});

//Metodo Eliminar 

 /*router.delete('/:id', async function (req, res) {
    try{
        const {id} = req.params;

        const generoEliminado = await Genero.findByIdAndDelete(id);

        if (!generoEliminado){
            return res.status(404).send('Género no encontrado');
        }

        res.send('Género eliminado exitosamente');
    } catch (error){
        res.sendStatus(500).send('Ocuarrio un error al eliminar al Genero');
    }
 })*/

module.exports = router;