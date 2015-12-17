ServiceConfiguration.configurations.upsert({
	service: 'google'},
	{
		$set: {
			clientId: '701653599547-pd6dig6i6v685c471ihlfki387g337ug.apps.googleusercontent.com',
			secret: 'zkMzVixrnlOYnwjNIyJ_nskG',
			loginStyle: 'redirect',
		}
	}
);

var geo = new GeoCoder({
	  geocoderProvider: "google",
	  httpAdapter: "https",
		apiKey: 'AIzaSyCKJbe8J8OdYgzAj34IoAn7VHv8L75e9E4'
});
