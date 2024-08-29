package com.niot;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cn.nodemedia.react_native_nodemediaclient.NodeMediaReactPackage;
import org.wonday.live.RNLiveStreamPackage;
import com.kalyzee.rctgstplayer.RCTGstPlayerPackage;
import expo.core.ExpoModulesPackage;
import com.ghondar.vlc.VlcPlayerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.RNTextInputMask.RNTextInputMaskPackage;
import com.lynxit.contactswrapper.ContactsWrapperPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new NodeMediaReactPackage(),
            new RNLiveStreamPackage(),
            new RCTGstPlayerPackage(),
            new ExpoModulesPackage(),
            new VlcPlayerPackage(),
            new RNCWebViewPackage(),
            new RNTextInputMaskPackage(),
            new ContactsWrapperPackage(),
            new VectorIconsPackage(),
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
  }
}
