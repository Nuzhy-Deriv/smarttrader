import React from 'react';
import Loading from '../../../_common/components/loading.jsx';
import { FormRow, SubmitButton } from '../../../_common/components/forms.jsx';

const OtpForm = () => (
    <React.Fragment>
        <form id='frm_two_factor_auth' className='invisible'>
            <FormRow is_two_rows type='text' id='otp' />
            <SubmitButton no_wrapper msg_id='form_message' type='submit' />
        </form>
    </React.Fragment>
);

const TwoFactorAuthentication = () => (
    <React.Fragment>
        <h1>{it.L('Two-Factor Authentication')}</h1>
        <p>{it.L('Protect your account with two-factor authentication. Each time you sign into your account, you will need to enter your password, plus an authentication code generated by an app on your smartphone.')}</p>

        <div id='two_factor_loading'><Loading /></div>

        <div id='disabled' className='invisible'>
            <div>
                <p>{it.L('Two-factor authentication is currently disabled.')}</p>
            </div>

            <h2>{it.L('How to setup two-factor authentication for your [_1] account', it.website_name)}</h2>

            <div className='steps'>
                <div className='step'>
                    <div className='border-bottom' />
                    <div className='circle'>1</div>
                    <div className='center-text'>
                        <p>{it.L('Scan the QR code below with your authentication app (such as Google Authenticator, Authy, and Duo Mobile)')}</p>
                        <div id='qrcode_loading'><Loading /></div>
                        <div id='qrcode' />
                    </div>
                </div>
                <div className='step'>
                    <div className='border-bottom' />
                    <div className='circle'>2</div>
                    <div className='center-text'>
                        <p>{it.L('Enter the authentication code generated by the app below')}</p>
                    </div>
                </div>
            </div>
        </div>

        <div id='enabled' className='invisible'>
            <div>
                <p>{it.L('Two-factor authentication is currently enabled.')}</p>
            </div>
        </div>

        <OtpForm />
    </React.Fragment>
);

export default TwoFactorAuthentication;
