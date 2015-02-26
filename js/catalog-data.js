(function(window, document) {
	var catalogData = {"Test Category": "A file-like structured json object"};
	var catalogCourseObject = {};
	var debug = false;
	
	$(document).ready(function() {
		$.ajax({
			url: location.protocol+"//is.byu.edu/site/courses/catalogdata.json.cfm",
			dataType: "json"
		}).done(function( data, textStatus ) {
			//if(debug) console.log(data);
			allCatalogData = data['courses'];
			catalogCourseObject = {};
			var acceptableSchoolTypes = ["HIGH SCHOOL","MIDDLE SCHOOL"];
			
			
			for(schoolType in allCatalogData) {
				if(debug) console.log("searching for school type("+schoolType+"): " + acceptableSchoolTypes.indexOf(schoolType.toUpperCase()));
				if(acceptableSchoolTypes.indexOf(schoolType.toUpperCase()) > -1) {
					var catalogData = allCatalogData[schoolType];
					for(var category in catalogData) {
						if(debug) console.log("Course category: " + catalogData[category]);
						for(var j=0; j < catalogData[category].length ; j++){
							for(var k=0; k < catalogData[category][j]['types'].length; k++) {
								var courseTitle = catalogData[category][j]['highschool-title'].trim()+" "+catalogData[category][j]['types'][k]['type'].trim();
								if(debug) console.log("processing course: ["+k+"] " + courseTitle);
								if(Object.keys(catalogCourseObject).indexOf(courseTitle) == -1) {
									catalogCourseObject[courseTitle] = $.extend(true, {}, catalogData[category][j]);
									catalogCourseObject[courseTitle]['type'] = catalogData[category][j]['types'][k];
									//catalogCourseObject[courseTitle]['types'] = {};
									if(debug) console.log("current type: "+catalogCourseObject[courseTitle]['type']['type']);
									if(debug) console.log("Added course: ");
									if(debug) console.log(catalogCourseObject[courseTitle]);
								} else {
									if(debug) console.log(courseTitle + " already input. "+courseTitle);
								}
							}
						}
					}
				}
			}
			if(debug) console.log(catalogCourseObject);
			var catalogCourseList = Object.keys(catalogCourseObject);
			catalogCourseList.sort();
			if(debug) console.log("catalogCourseList:");
			if(debug) console.log(catalogCourseList);
			//$("#course").replaceWith($('<select name="course"></select>').attr("id","course").addClass("be-there"));
			//for(var i=0;i<catalogCourseList.length;i++) {
			//	$("#course").append($('<option>'+catalogCourseList[i]+'</option>'));
			//}
			
			$("#course-select-application").autocomplete({
				delay: 500,
				minLength: 3,
				source: catalogCourseList,
				change: function( e,ui ) {
					var $this = $(this);
					if(debug) console.log("Chosen Course: "+$(this).val());
					if(debug) {
						console.log("chosen course data: ");
						console.log(catalogCourseObject[$(this).val()]);
					}
					//$("#hidden-course").val(catalogCourseObject[$(this).val()].type['short-title']);
					console.log("autocomplete change");
					console.log(catalogCourseObject[$(this).val()]);
					
					ajaxCallSend( $this.attr('data-scholarship-id'), $this.attr('data-action'), $this, {}, function( dataORjqXHR, textStatus, jqXHRORerrorThrown ) {		//	lbg:catalogCourseObject[$this.val()].type['lbg']
						var jqXHR = (testForJQXHR(jqXHRORerrorThrown))?jqXHRORerrorThrown:dataORjqXHR,
							data = (testForJQXHR(jqXHRORerrorThrown))?dataORjqXHR:null,
							errorThrown = (!testForJQXHR(jqXHRORerrorThrown))?jqXHRORerrorThrown:null,
							status = textStatus || null,
							$el = this['$el']
						;
						console.log("course update handler!");
						console.log(data);
						var newPrice = parseFloat((data['course-price']+"").replace(/[^\d\.]/g,"")),
							newPriceText = newPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
							newSuggestedPrice =	parseFloat((data['course-price-suggestion']+"").replace(/[^\d\.]/g,"")),
							newSuggestedPriceText = newSuggestedPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
						;
						$el.parent().parent().find(".course-price").html(newPriceText);
						$el.parent().parent().find(".course-price-suggestion").html(newSuggestedPriceText);
					});
				}
			});
			$(".course-select").autocomplete("enable");
		});
	});
	
	String.prototype.toTitleCase = function() {
	    return (this instanceof String)?this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}):"";
	};
	
	$(".submitButton").on("click",function() {
		var formdata = $("#contactForm").serializeArray(),
			validated = true,
			messages = [],
			nameMap = {
				"school":"You must provide a High School Name.",
				"schoolState":"You must select a State for your High School.",
				"net_id":"Please specify a student Net ID.",
				"identity":"Please specify a student name.",
				"course":"You must provide a course to which you want the scholarship to apply.",
				"course_shorttitle":"The course you specify must match one provided.",
				"GPA":"Please specify a GPA for the student.",
				"message":"Your recommendation is very valuable to us. Please type at least something in the field provided."
			}
		;
		if(debug) console.log(formdata);
		for(var i=0;i < formdata.length;i++) {
			if(debug) console.log(formdata[i].name + ": " + formdata[i].value);
			if(formdata[i].value.trim() == "" || formdata[i].value.trim() == "unknown" || formdata[i].value.trim() == "undefined" || formdata[i].value.trim() == "null") {
				validated = false;
				messages[messages.length] = nameMap[formdata[i].name];
			} else {
			}
		}
		if(validated) {
			//alert("valid");
			$("#contactForm").submit();
		} else {
			alert("Please fill out the form completely.\n\n" + messages.join("\n"));
		}
	});
	
})(window, document);
