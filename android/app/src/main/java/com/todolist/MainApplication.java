package com.todolist;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import cl.json.RNSharePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.rnfs.RNFSPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.dooboolab.RNAudioRecorderPlayerPackage;
import com.kishanjvaghela.cardview.RNCardViewPackage;
import com.rnappauth.RNAppAuthPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import io.realm.react.RealmReactPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import java.util.Arrays;
import com.facebook.react.shell.MainReactPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oney.WebRTCModule.WebRTCModulePackage;

import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import io.invertase.firebase.auth.ReactNativeFirebaseAuthPackage;
import io.invertase.firebase.database.ReactNativeFirebaseDatabasePackage;
import io.invertase.firebase.storage.ReactNativeFirebaseStoragePackage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNSharePackage(),
            new FBSDKPackage(),
            new ReactNativeFirebaseAppPackage(),
            new ReactNativeFirebaseAuthPackage(),
            new ReactNativeFirebaseDatabasePackage(),
            new ReactNativeFirebaseStoragePackage(),
            new ReactNativeFirebaseMessagingPackage(),
            new RNFSPackage(),
            new DocumentPickerPackage(),
            new RNFileViewerPackage(),
            new ReactNativeAudioPackage(),
            new RNAudioRecorderPlayerPackage(),
            new RNCardViewPackage(),
            new RNAppAuthPackage(),
            new RNScreensPackage(),
            new RealmReactPackage(),
            new SafeAreaContextPackage(),
            new ReanimatedPackage(),
			      new WebRTCModulePackage(),
            new RNGoogleSigninPackage(),
            new RNGestureHandlerPackage()
          );
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
    //FacebookSdk.sdkInitialize(getApplicationContext());
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
