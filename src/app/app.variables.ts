export const variables = {
    config: {
      maxVideoSize: 18874368 // In Bytes - 18MB
    },
    style: {
      dimensions: {
        starSizeResponsive: '12px',
        starSize: '18px'
      },
      colors: {
        activeStar: '#facb00',
        inactiveStar: '#c9c0bf'
      }
    },
    storageVariables: {
      AccessToken: 'AccessToken',
      RefreshToken: 'RefreshToken',
      RefreshTokenHeader: 'RefreshTokenHeader',
      TokenExpiry: 'TokenExpiry',
      Language: 'language',
      ID: '_id',
      Name: 'name',
      Image: 'image',
      IsEmail: 'isEmail',
      Email: 'email',
      PhoneNumber: 'phoneNumber',
      Number: 'number',
      PhoneCode: 'phoneCode',
      Wallet: 'wallet',
      allowedToRoute: 'allowedToRoute'
    },
    AuthenticationUri: {
      logout: 'authentication/logout',
      refreshToken: 'authentication/refreshToken',
      userSignUp: 'users/',
      userCheckOtp: 'users/checkOtp',
      resendOtp: 'users/resendOtp',
      resetPasswordCheckToken: 'users/checkToken',
      resetPasswordResendOTP: 'users/resendPassOtp',
      signIn: 'authentication/authenticate',
      registerNotification: 'users/register',
      forgotPassword: 'users/forgot',
      changePassword: 'users/changePassword'
    },
    emailRegex: '[A-Za-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?', // tslint:disable-line:max-line-length
    settings: {
      getUserProfile: 'api/userProfile',
      saveUserProfile: 'api/userProfile'
    },
    dashboard: {
      getDashboard: 'play',
      verifyPurchase: 'ticket/validate'
    },
    faq: {
      getFaqs: 'faq'
    },
    plays: {
      getPlays: 'play/search',
      getCountriesByShow: 'play/show/countries'
    },
    staticPages: {
      getStaticPages: 'lov'
    },
    profile: {
      getProfile: 'users/profile',
      saveProfile: 'users/profile',
      uploadImage: 'users/image',
      deleteImage: 'users/image',
      getEvents: 'ticket'
    },
    receipt: {
      getReceipt: 'ticket/receipt',
      refundTickets: 'ticket/refund'
    },
    showDetails: {
      getShowByID: 'play/show',
      getShowByIDAndCountry: 'play/countries',
      getZones: 'zone/play',
      getSeats: 'map/zone',
      bookSeats: 'ticket',
      paymentMethods: 'ticket/paymentMethods'
    },
    contactUs: {
      submit: 'contact'
    },
    socialMediaLink: {
      insta: 'test',
      facebook: 'test',
      mail: 'test',
      twitter: 'test'
    },
    routes: {
      dashboard: '',
      authentication: 'a',
      signUpAuth: 'sign-up',
      signInAuth: 'sign-in',
      forgotPasswordAuth: 'forgot-password',
      resetPasswordAuth: 'reset-password',
      signUp: 'a/sign-up',
      signIn: 'a/sign-in',
      forgotPassword: 'a/forgot-password',
      profile: 'profile',
      show: 'show',
      showStepOne: 'show/details',
      showStepTwo: 'show/zones',
      showStepThree: 'show/tickets',
      showStepFour: 'show/payment',
      dashboard_full: 'dashboard',
      contactUs: 'contactUs',
      faqs: 'faqs',
      terms: 'terms',
      aboutUs: 'aboutUs',
      howItWorks: 'howItWorks',
      plays: 'shows'
    },
    googleAnalytics: {
      dashboard_screen: 'Dashboard',
      register_screen: 'Sign Up',
      login_screen: 'Login',
      forgot_password_screen: 'Forgot Password',
      show_details_screen: 'Show Details',
      profile_screen: 'Profile',
      plays_screen: 'Shows',
      aboutUs_screen: 'About Us',
      howItWorks_screen: 'How it Works',
      terms_screen: 'Privacy Policy & Terms of Use',
      faqs_screen: 'FAQs',
      contactUs_screen: 'Contact Us'
    }
  }
;
