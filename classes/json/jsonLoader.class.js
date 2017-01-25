module.exports = function JSONLoader(jsons, models) {
    this.jsons = jsons;
    this.models = models;
    this.studentModel = this.models[0];
    this.educationModel = this.models[1];
    this.teacherModel = this.models[2];

    this.fillData = function() {

        deleteAll(function (err, resp) {
            console.log(resp + " / " + err);
            //
            createFillSchemas(function (err, resp) {
                console.log(resp + " / " + err);
                //
                bindKeys(function (err, resp) {

                });
            });
        });
    };

    function deleteAll(cb) {
        this.models.forEach(function (model, index) {
            model.deleteAll(function (err, resp) {
                if (index === (models.length - 1)) {
                    cb(err, "All databases cleared");
                }
            });
        });
    }

    function createFillSchemas(cb) {
        this.jsons.forEach(function (currJson, index) {
            this.models[index].createFromJsonWithNotify(currJson, function (err, resp) {
                console.log("schema created: " + resp.toString());
                if (index === (models.length - 1)) {
                    cb(err, "All shemas created");
                }
            });
        });
    }

    function bindKeys(cb) {
        //bind education to students
        this.educationModel.find({}, function (err, educations) {
            this.studentModel.find({}, function (err, studs) {
                studs.forEach(function (stud) {
                    var randomEdu = getRandom(educations);
                    stud._education = randomEdu._id;
                    stud.save();
                    console.log("A:_id set for: " + stud.name + " : " + randomEdu._id);
                });
            });
        });

        //bind teachers to educations
        this.teacherModel.find({}, function (err, teachers) {
            educationModel.find({}, function (err, educations) {
                educations.forEach(function (edu) {
                    var randomTeacher = getRandom(teachers);
                    edu._teachers.push(randomTeacher._id);
                    edu.save();
                    console.log("B:_id set for: " + edu.name + " : " + randomTeacher._id);
                });
            });
        });


        //bind educations to teachers 
        this.educationModel.find({}, function (err, educations) {
            teacherModel.find({}, function (err, teachers) {
                teachers.forEach(function (teacher) {
                    var randomEdu = getRandom(educations);
                    teacher._educations.push(randomEdu._id);
                    teacher.save();
                    console.log("C:_id set for: " + teacher.name + " : " + randomEdu._id);
                });
            });
        });
    }

    function getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
 
   //
   return this;
};

