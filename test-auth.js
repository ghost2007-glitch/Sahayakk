import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sflovpfjzsllpvwrkqxt.supabase.co';
const supabaseKey = 'sb_publishable_4RwdZCi2qhS2kP35K2uMJg_F5uWUNEX';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';

  console.log('Testing SignUp...');
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Test User',
        phone: '9876543210'
      }
    }
  });

  if (signUpError) {
    console.error('SignUp Error:', signUpError);
    return;
  }
  console.log('SignUp Success!');
  console.log('User ID:', signUpData.user?.id);
  console.log('Session present?', !!signUpData.session);

  console.log('\nTesting Login...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    console.error('Login Error:', loginError);
  } else {
    console.log('Login Success!');
    console.log('Session present?', !!loginData.session);
  }

  if (loginData.session || signUpData.session) {
    const userId = loginData.user?.id || signUpData.user?.id;
    console.log('\nTesting Profile Fetch...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('Profile Fetch Error:', profileError);
    } else {
      console.log('Profile Fetch Success:', profileData);
    }
  }
}

run();
