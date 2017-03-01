module.exports = function JSONLoader(models) {
    this.models = models;
    this.studentModel = this.models[0];
    this.educationModel = this.models[1];
    this.teacherModel = this.models[2];
    this.bookingModel = this.models[3];
    this.classModel = this.models[4];

    this.studentsJson = require('./students.json');
    this.educationsJson = require('./educations.json');
    this.teachersJson = require('./teachers.json');
    this.bookingsJson = require('./bookings.json');
    this.classroomsJson = require('./classrooms.json');
    this.loginsJson = require('./logins.json');
    this.accessJson = require('./access.json');

    this.jsons = [this.studentsJson, this.educationsJson, this.teachersJson, this.bookingsJson, this.classroomsJson, this.loginsJson, this.accessJson];


    this.fillData = function () {
        deleteAll(function (err, resp) {
            console.log(resp + " / " + err);
            //
            createFillSchemas(function (err, resp) {
                console.log(resp + " / " + err);
                //
                bindKeys(function () {

                    bindCustom(function () {

                    });

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
                if (index === (this.models.length - 1)) {
                    cb(err, "All shemas created ");
                }
            });
        });
    }

    function bindCustom(cb) {
        console.log("bind custom");
        var me = this;
        this.educationModel.findOne({name: 'suw16'}, function (err, edu) {
            me.studentModel.findOne({epost: 'gmor@gmail.com'}, function (err, stud) {
                stud._education = edu._id;
                stud.save(function (err, doc) {
//                    console.log("saved morge:", doc);
                });
            });

        });

    }

    function bindKeys(cb) {
        var me = this;
        //bind education to students
        this.educationModel.find({}, function (err, educations) {
            me.studentModel.find({}, function (err, studs) {
                studs.forEach(function (stud) {
                    var randomEdu = getRandom(educations);
                    stud._education = randomEdu._id;
                    stud.save(function (err, doc) {
                        console.log("A:_id set for: " + stud.name + " : " + randomEdu._id);

                    });

                });
            });
            cb();
        });





        //bind teachers to educations
//        for(var i = 0; i < 2; i++){
//            this.teacherModel.find({}, function (err, teachers) {
//              me.educationModel.find({}, function (err, educations) {
//                  educations.forEach(function (edu) {
//                      var randomTeacher = getRandom(teachers);
//                      edu._teachers.push(randomTeacher._id);
//                      edu.save();
//                      console.log("B:_id set for: " + edu.name + " : " + randomTeacher._id);
//                  });
//              });
//            });
//        }


        //bind educations to teachers 
//        this.educationModel.find({}, function (err, educations) {
//            me.teacherModel.find({}, function (err, teachers) {
//                teachers.forEach(function (teacher) {
//                    var randomEdu = getRandom(educations);
//                    teacher._educations.push(randomEdu._id);
//                    teacher.save();
//                    console.log("C:_id set for: " + teacher.name + " : " + randomEdu._id);
//                });
//            });
//        });

        //bind educations to booking 
//        this.educationModel.find({}, function (err, educations) {
//            me.bookingModel.find({}, function (err, bookings) {
//                bookings.forEach(function (booking) {
//                    var randomEdu = getRandom(educations);
//                    booking._education = randomEdu._id;
//                    booking.save();
//                    console.log("D:_id set for, booking: " + booking.name + " : " + randomEdu._id);
//                });
//            });
//        });

        //bind classrooms to booking 
//        this.classModel.find({}, function (err, classrooms) {
//            me.bookingModel.find({}, function (err, bookings) {
//                bookings.forEach(function (booking) {
//                    var randomClass = getRandom(classrooms);
//                    booking._classroom = randomClass._id;
//                    booking.save();
//                    console.log("E:_id set for, booking: " + booking.name + " : " + randomClass._id);
//                });
//            });
//        });

    }

    function getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }



    //
    return this;
};

