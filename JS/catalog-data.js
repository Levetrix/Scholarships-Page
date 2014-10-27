var catalogData = {"Test Category": "A file-like structured json object"};
var catalogCourses = {};
var debug = false;
$(document).ready(function() {
	$.ajax({
		url: "http://is.byu.edu/site/courses/catalogdata.json.cfm",
		dataType: "json"
	}).done(function( data, textStatus ) {
		//if(debug) console.log(data);
		allCatalogData = data['courses'];
		catalogCourses = {};
		var acceptableSchoolTypes = ["HIGH SCHOOL","MIDDLE SCHOOL"];
		
		$("#course").replaceWith($('<select name="course"></select>').attr("id","course").addClass("be-there"));
		
		for(schoolType in allCatalogData) {
			if(debug) console.log("searching for school type("+schoolType+"): " + acceptableSchoolTypes.indexOf(schoolType.toUpperCase()));
			if(acceptableSchoolTypes.indexOf(schoolType.toUpperCase()) > -1) {
				var catalogData = allCatalogData[schoolType];
				for(var category in catalogData) {
					if(debug) console.log("Course category: " + catalogData[category]);
					for(var j=0; j < catalogData[category].length ; j++){
						var courseTitle = catalogData[category][j]['course-title'];
						if(Object.keys(catalogCourses).indexOf(courseTitle) == -1) {
							catalogCourses[courseTitle] = catalogData[category][j];
							if(debug) console.log("Adding course: ");
							if(debug) console.log(catalogData[category][j]);
						} else {
							if(debug) console.log(courseTitle + " already input. "+courseTitle);
						}
					}
				}
			}
		}
		if(debug) console.log(catalogCourses);
		var catalogCourseList = Object.keys(catalogCourses);
		catalogCourseList.sort();
		if(debug) console.log(catalogCourseList);
		for(var i=0;i<catalogCourseList.length;i++) {
			$("#course").append($('<option>'+catalogCourseList[i]+'</option>'));
		}
	});
});

String.prototype.toTitleCase = function() {
    return (this instanceof String)?this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}):"";
};





