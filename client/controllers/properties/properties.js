Template.Properties.onRendered(function() {
	$('.side-nav li').removeClass('active');
	$('.side-nav li.properties').addClass('active');
	$('ul.tabs').tabs();
	$('select').material_select();
});

Template.Properties.helpers({
	properties: function() {
		return Properties.find();
	}
});

Template.Properties.events({
	'click #btn_addProperty': function(){
		var opt = {
			reference: $('#inputRef_prop').val(),
			transactionType: $('#inputTrans_prop').val(),
			propertyType: $('#inputProp_prop').val(),
			year: $('#inputYear_prop').val(),
			price: $('#inputPrice_prop').val(),
			geocode: $('#inputAdress_prop').val(),
			exclusive: $('#inputExclu_prop').val(),
			roomNumber: $('#inputRoom_prop').val(),
			bedroomNumber: $('#inputBed_prop').val(),
			bathroomNumber: $('#inputBath_prop').val(),
			closetNumber: $('#inputCloset_prop').val(),
			livingRoomSurface: $('#inputLiving_prop').val(),
			totalSurface: $('#inputTotal_prop').val(),
			state: $('#inputState_prop').val(),
			configuration: $('#inputConfig_prop').val(),
			floorNumber: $('#inputFloor_prop').val(),
			heating: $('#inputHeating_prop').val(),
			terrainSurface: $('#inputTerrain_prop').val(),
			garage: $('#inputGarage_prop').val(),
			dependencyNumber: $('#inputDep_prop').val(),
			dpe: $('#inputDpe_prop').val(),
			ges: $('#inputGes_prop').val(),
			taxes: $('#inputTaxes_prop').val(),
			charges: $('#inputCharges_prop').val(),
			title: $('#inputTitle_prop').val(),
			description: $('#inputDesc_prop').val(),
			visible: $('#inputVisible_prop').val(),
			localInformation: $('#inputLocalInf').val(),
			commision: $('#inputComision_prop').val(),
			history: $('#inputHistory_prop').val(),
			estimation: $('#inputEsti_prop').val()
		};

		console.log(opt);

		var res = Meteor.call('addProperty', opt);
	}
});

Template.listProperty.onCreated(function(){
	this.searchList = new ReactiveVar([]);
	Template.instance().searchList.set(Properties.find({}));
});

Template.listProperty.helpers({
	searchList: function(){
		return Template.instance().searchList.get();
	}
});

Template.listProperty.events({
	'keyup #search': function(e, t){
		if ($(e.target).val() != '') {
			query = new RegExp($(e.target).val(), 'i');
			list = Properties.find({ title: query }).fetch();
		} else {
			list = [];
		}
		t.searchList.set(list);
	}
});
