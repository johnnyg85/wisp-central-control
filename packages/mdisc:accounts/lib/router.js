Router.plugin('ensureSignedIn', {
  except: _.pluck(AccountsTemplates.routes, 'name').concat(['home'])
});

/*
//Routes
AccountsTemplates.configureRoute('changePwd', {
  name: 'atChangePwd',
  path: '/change-password',
  template: 'atFormModal'
});
AccountsTemplates.configureRoute('enrollAccount', {
  name: 'atEnrollAccount',
  path: '/enroll-account',
  template: 'atFormModal'
});
AccountsTemplates.configureRoute('forgotPwd', {
  name: 'atForgotPwd',
  path: '/forgot-password',
  template: 'atFormModal'
});
AccountsTemplates.configureRoute('resetPwd', {
  name: 'atResetPwd',
  path: '/reset-password',
  template: 'atFormModal'
});
AccountsTemplates.configureRoute('signIn', {
  name: 'atSignIn',
  path: '/sign-in',
  template: 'atFormModal'
});
AccountsTemplates.configureRoute('signUp', {
  name: 'atSignUp',
  path: '/sign-up',
  template: 'atFormModal'
});
AccountsTemplates.configureRoute('verifyEmail', {
  name: 'atVerifyEmail',
  path: '/verify-email',
  template: 'atFormModal'
});
AccountsTemplates.configureRoute('resendVerificationEmail', {
  name: 'atresendVerificationEmail',
  path: '/send-again',
  template: 'atFormModal'
});
*/