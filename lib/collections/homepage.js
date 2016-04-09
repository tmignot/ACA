HomePage = new Mongo.Collection('home_page');
Meteor.Collections['editor'] = HomePage;

if (Meteor.isServer) {
	Meteor.publish('editor', function(){
		return [
			HomePage.find(),
			htmlBlocks.find()
		];
	});

	Meteor.publish('home_page', function(){
		return [
			HomePage.find(),
			htmlBlocks.find(),
			Properties.find({visible: true, estimation: false})
		];
	});

	Meteor.startup(function(){
		if (HomePage.find().count() === 0) {
			var home = {
				id: 1,
				bgColor: "#000000",
				mainColor: "#622181",
				logoUrl: "/logoagence.png",
				lstVal: [
					{cl: 'nPieces', label: 'Nombre de pieces', values: ['1','2','3','4','5','6','7 et +']},
					{cl: 'nState', label: 'Etat du bien', values: ['tout a refaire','travaux a prevoir','bon etat general','neuf']},
					{cl: 'nHeating', label: 'Chauffage', values: ['bois','gaz','electrique','fioul']},
					{cl: 'nCustomerType', label: 'Type d\'acquereur', values: ['Achat', 'Location']}
				],
				blocks: {
					search_title: {label: 'Barre de recherche, titre', value: 'Recherchez un bien'},
					section1_title: {label: 'Section 1, titre', value: 'A propos'},
					section1_left_text: {label: 'Section 1, texte de gauche', value:'Freelancer is a free bootstrap theme created by Start Bootstrap. The download includes the complete source files including HTML, CSS, and JavaScript as well as optional LESS stylesheets for easy customization.'},
					section1_right_text: {label: 'Section 1, texte de droite', value:	"Whether you're a student looking to showcase your work, a professional looking to attract clients, or a graphic artist looking to share your projects, this template is the perfect starting point!"},
					section2_title: {label: 'Section 2, titre', value: 'Contactez-nous'},
					section2_text: {label: 'Section 2, texte', value: 'Vous allez nous adorer !'},
					agency_name: {label: "Nom de l'agence", value: "L'Agence Coubron"},
					agency_address: {label: "Adresse de l'agence", value: "155 rue Jean-Jaurès, 93470 Coubron"},
					agency_phone: {label: "Numero de l'agence", value: '01.43.51.28.86'},
					agency_email: {label: "e-mail de l'agence", value: 'agence@acaimmo.fr'},
					agency_timetable_label: {label: 'Horaires, titre', value: 'Nos horaires'},
					agency_timetable: {
						monday: {	morning: '9h-12h', evening: '13h30-19h30' },
						tuesday: {	morning: '9h-12h', evening: '13h30-19h30' },
						wednesday: {	morning: '9h-12h', evening: '13h30-19h30' },
						thursday: {	morning: '9h-12h', evening: '13h30-19h30' },
						friday: {	morning: '9h-12h', evening: '13h30-19h30' },
						saturday: {	morning: '9h-12h', evening: 'Fermé' },
						sunday: {	morning: 'Fermé', evening: 'Fermé' }
					},
					footer_left_title: {label: 'Section 3, titre de gauche', value:'Partenaires'},
					footer_left_text: {label: 'Section 3, texte de gauche', value:'Consultez les annonces de toutes nos agences'},
					footer_left_text2: {label: 'Section 3, liens de gauches', value: '<a href="">Courtry</a> <a href="">Sucy</a>'},
					footer_middle_title: {label: 'Section 3, titre du centre', value:'Retrouvez-nous'},
					footer_right_title: {label: 'Section 3, titre de droite', value:'Mentions legales'},
					footer_right_text: {label: 'Section 3, texte de droite', value:	'Garant : QBE FRANCE - 21 rue Balzac - 75406 Paris cedex 08 - 150 000 Eurosa<br>N° de carte transaction et gestion : T06-0747<br>RCS BOBIGNY 410 250 781'}
				}
			};
			
			console.log('insert home_page');
			HomePage.insert(home);
		}
	});
}

HomePage.allow({
	insert: function(doc) { return true; },
	update: function(doc, id) { return true; },
	remove: function(id) { return false; }
});

HomePage.deny({
	insert: function() { return false; },
	update: function() { return false; },
	remove: function() { return true; }
});
