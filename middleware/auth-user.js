export default async function ({ $auth, redirect, $toast }) {
  let user = $auth.loggedIn

  if (user) {
    redirect('/')
    $toast.info('you must log out first.')
  } else {
    // $toast.error('kindly log in')
    // alert('Kindly Log in to access Services')
  }
}
