const Photo = require("../models/Photo");
const fs = require("fs");

exports.getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort({ dateCreated: "desc" });
  res.render("index", { photos });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", { photo });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + "/../public/uploads/" + uploadedImage.name;

  uploadedImage.mv(
    uploadPath,

    async () => {
      await Photo.create({
        ...req.body,
        image: "/uploads/" + uploadedImage.name,
      });
      res.redirect("/");
    }
  );
};

exports.updatePhoto = async (req, res) => {
  //FindById sadece _id ye göre arar ve bulur. FindOne kullanırken name, title, detail, dateCreated ve o collection içinde her ne varsa ona göre aratıp eşleşen ilk kayıdı bulur.
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  // VEYA bu şekilde kullanılabilir
  //  const photo = await Photo.findByIdAndUpdate(req.params.id, req.body);
  // photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + "/../public" + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect("/");
};
