/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2014 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.json.JSONObject;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.darkoverlordofdata.asteroids.R;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;

import com.firebase.client.AuthData;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class AppActivity extends Cocos2dxActivity {

    private static final String firebase_url = "https://asteroids-d16a.firebaseio.com";
    private static final int STATUS_WAITING = 0;
    private static final int STATUS_FACEBOOK_CONNECTED = 1;
    private static final int STATUS_FIREBASE_CONNECTED = 2;
    private static final int STATUS_CONNECTED = 3;
    private static final int STATUS_FAILED = 0x8000;

	private static AppActivity app = null;
    private static CallbackManager callbackManager;
    private static String id = ""; // Player FacebookID
    private static int status = STATUS_WAITING;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Firebase.setAndroidContext(this);
        final Firebase ref = new Firebase(firebase_url);

        app = this;
        FacebookSdk.sdkInitialize(this.getApplicationContext());
        callbackManager = CallbackManager.Factory.create();
        LoginManager.getInstance().registerCallback(callbackManager,
            new FacebookCallback<LoginResult>() {

                @Override
                public void onSuccess(LoginResult loginResult) {

                    // get the facebook id
                    GraphRequest.newMeRequest(
                        loginResult.getAccessToken(), new GraphRequest.GraphJSONObjectCallback() {
                            @Override
                            public void onCompleted(JSONObject me, GraphResponse response) {
                                if (response.getError() != null) {
                                    // handle error
                                    status = STATUS_FAILED;
                                } else {
                                    id = me.optString("id");
                                    status = STATUS_FACEBOOK_CONNECTED;
                                }
                            }
                        }).executeAsync();

                    // authenticate firebase using facebook token
                    ref.authWithOAuthToken("facebook", loginResult.getAccessToken().getToken(), new Firebase.AuthResultHandler() {
                        @Override
                        public void onAuthenticated(AuthData authData) {
                            // The Facebook user is now authenticated with your Firebase app
                            status = STATUS_FIREBASE_CONNECTED;
                        }

                        @Override
                        public void onAuthenticationError(FirebaseError firebaseError) {
                            // there was an error
                            Log.d("FirebaseError", firebaseError.getDetails());
                            status = STATUS_FAILED;
                        }
                    });
                }

                @Override
                public void onCancel() {
                    status = STATUS_FAILED;
                }

                @Override
                public void onError(FacebookException exception) {
                    status = STATUS_FAILED;
                    Log.d("FacebookException", exception.getMessage());
                }
            });

        Collection<String> permissions = Arrays.asList("public_profile");
        LoginManager.getInstance().logInWithReadPermissions(app, permissions);
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        return glSurfaceView;
    }

    @Override
    protected void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        callbackManager.onActivityResult(requestCode, resultCode, data);
    }

    /**
     * updateLeaderboard
     *
     * Usage:
     *
     * jsb.reflection.callStaticMethod(
     *      'org/cocos2dx/javascript/AppActivity',
     *      'updateLeaderboard',
     *      '(Ljava/lang/String;I)V',
     *      'asteroids', 42);
     *
     *
     * @param leaderboard
     * @param score
     */
    public static void updateLeaderboard(final String leaderboard, final int score) {

        if (STATUS_CONNECTED == status) {
            Firebase.setAndroidContext(app);
            final Firebase ref = new Firebase(firebase_url);

            Firebase postRef = ref.child("tests");
            Map<String, String> postScore = new HashMap<String, String>();
            postScore.put("leaderboard", leaderboard);
            postScore.put("id", id);
            postScore.put("score", ""+score);
            postRef.push().setValue(postScore);
        }
    }

    public static void showAlertDialog(final String title, final String message) {

        app.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AlertDialog alertDialog = new AlertDialog.Builder(app).create();
                alertDialog.setTitle(title);
                alertDialog.setMessage(message);
                alertDialog.setIcon(R.drawable.icon);
                alertDialog.show();
            }
        });
    }

}
