export const environment = {
  production: false,
  url: 'https://apiuat.alballambooking.com/',
  appUrl: 'https://webuat.alballambooking.com/',
  oneSignalAppId: '1d39dd84-9454-4b72-bda6-471902523345',
  captchaSiteKey: '6LdyA-oUAAAAAEp-AQv77jFS9HsT1fA8IFOUDS7I',
  outlookClientId: 'e54f9592-30ec-47b7-bf92-43233450e3fc',
  googleCalendarObj: {
    apiKey: 'AIzaSyDbVOmmWqE03NwVKl9RCResmBUVlbJTG9k',
    clientId: '510934446104-v4gtjro6aab6iot391mdsq00gr4mm8li.apps.googleusercontent.com',
    project_id: 'alballam-booking-system',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    redirect_uris: ['https://alballambooking.eurisko.me', 'https://webuat.alballambooking.com/'],
    javascript_origins: ['http://localhost', 'http://localhost:4200',
      'https://alballam-booking-system.firebaseapp.com', 'https://alballambooking.eurisko.me', 'https://webuat.alballambooking.com/'],
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    scope: 'https://www.googleapis.com/auth/calendar',
    fetch_basic_profile: true,
    redirect_uri: 'https://webuat.alballambooking.com/'
  }
};
