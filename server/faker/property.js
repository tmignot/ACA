tb_acquer = new Mongo.Collection('tb_acquer');
tb_acquer2 = new Mongo.Collection('tb_acquer2');
tb_agence = new Mongo.Collection('tb_agence');
tb_bien = new Mongo.Collection('tb_bien');
tb_departement = new Mongo.Collection('tb_departement');
tb_type_bien = new Mongo.Collection('tb_type_bien');

getPropertyType = function(old) {
	var type = tb_type_bien.findOne({id_type_bien: old.id_type_bien});
	type = !type? 'Maison' : (function(t){
		switch (t) {
			case 'LOCATION APPARTEMENT': return 'Appartement';
			case 'LOCATION PAVILLON': return 'Maison';
			case 'LOCAUX COMM': return 'Local commercial';
			case 'BOX et PARKING': return 'Box et Parking';
			default: return _.capitalize(t);
		}})(type.nom_type_bien);
	return type;
};

getGarage = function(old) {
	switch (typeof old.garage_bien) {
		case 'string': return old.garage_bien.match(/.*oui.*/i) ? true : false;
		case 'number': return old.garage_bien != 0;
		default: {
			console.log(old.garage_bien, typeof old.garage_bien);
			return 0;
		}
	}
};

getImage = function(old) {
	try {
		var prop = Properties.findOne({old_id: old.id_bien});
		if (prop.images && prop.images.length)
			return;
		var i = 1;
		while (i) {
			var host = 'http://www.lagencedecourtry.com/photos/',
					ext = '_'+i+'.jpg',
					id = old.id_bien;
			var file = new FS.File({name: function() {return id + ext}});
			file.attachData(host + id + ext, function(e) {
				if (e) {
					console.log('error:', e);
					i=0;
				} else {
					var img = Images.insert(file);
					Properties.update({old_id: id}, {$push: {images: img._id}});
					i+=1;
				}
			});
		}
	} catch(e) {
		console.log('error getting '+old.id_bien+' images:',e);
	}
};

counter = 0;
TranslateProperty = function(old) {
	if (Properties.findOne({old_id: old.id_bien}))
		return false;
	counter += 1;
	var data = {
		old_id: old.id_bien,
		reference: old.ref_bien.toString(),
		propertyType: getPropertyType(old),
		year: old.anneecontruction,
		price: old.prix_bien,
		geocode: _.capitalize(old.ville_bien) + ' ' + old.codepostal_bien.toString() + ' France',
		address: {
			city: _.capitalize(old.ville_bien),
			zipcode: old.codepostal_bien.toString(),
			country: 'France'
		},
		totalSurface: parseInt(old.surface_bien)? parseInt(old.surface_bien) : 0,
		livingRoomSurface: parseInt(old.surface_sejour_bien)? parseInt(old.surface_sejour_bien) : 0,
		terrainSurface: parseInt(old.terrain_bien)? parseInt(old.terrain_bien) : 0,
		roomNumber: parseInt(old.nb_pieces_bien)? parseInt(old.nb_pieces_bien) : 0,
		bedroomNumber: parseInt(old.nb_chambres_bien) ? parseInt(old.nb_chambres_bien) : 0,
		bathroomNumber: parseInt(old.nb_sdb_bien) ? parseInt(old.nb_sdb_bien) : 0,
		closetNumber: parseInt(old.nb_toilette_bien) ? parseInt(old.nb_toilette_bien) : 0,
		floorNumber: parseInt(old.nb_etages_bien) ? parseInt(old.nb_etages_bien) : 0,
		state: old.etat_bien,
		heating: old.chauffage_bien,
		garage: getGarage(old),
		dependencyNumber: old.dependance_bien.match(/.*oui.*/i) ? 1 : 0,
		configuration: old.configuration_bien,
		taxes: parseInt(old.taxe_fonciere_bien) ? parseInt(old.taxe_fonciere_bien) : 0,
		charges: parseInt(old.charges_bien) ? parseInt(old.charges_bien) : 0,
		dpe: parseInt(old.dpe_c) ? parseInt(old.dpe_c) : 1,
		ges: parseInt(old.ges_c) ? parseInt(old.ges_c) : 1,
		title: old.descriptif_titre_bien,
		description: old.descriptif_texte_bien,
		visible: old.publi_accueil_bien == 1,
		transactionType: old.achat_loc_bien ? 'Vente' : 'Location',
		commission: parseInt(old.commission_agence) ? parseInt(old.commission_agence) : 0,
		ownerInfo: old.infoproprietaire_bien,
		exclusive: false,
		estimation: false
	};
	var ctx = PropertySchema.newContext();
	if (!ctx.validate(data)) {
		console.log(ctx.invalidKeys());
		return false;
	};
	Properties.insert(data);
	getImage(old);
	return true;
};
