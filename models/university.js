var University = {
    id                  :  String,
    logo                :  String,
    name_en             :  String,
    name_kh             :  String,
    name_abbreviation   :  String,
    description          :  String,
    contact             : {
        phone           :  String,
        facebook_page   :  String,
        email           :  String,
        website         :  String,
        address         :  String
    },
    geography           : {
        location_lat    :  Number,
        location_long   :  Number,
        library         :  String,
        sport_facility  :  String,
        city            :  String
    }
};
module.exports = University