import { View, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#073d5c" 
        translucent={Platform.OS === 'android'}
      />
      {Platform.OS === 'ios' ? (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContainer}>
            {renderHeaderContent()}
          </View>
        </SafeAreaView>
      ) : (
        <View style={[styles.headerContainer, styles.androidHeader]}>
          {renderHeaderContent()}
        </View>
      )}
    </View>
  );

  function renderHeaderContent() {
    return (
      <>
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/FullLogo_Transparent-2.png')}
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="App logo"
          />
        </View>

        {/* Drawer Toggle Button */}
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => navigation.toggleDrawer()}
          activeOpacity={0.7}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <Ionicons 
            name={Platform.OS === 'ios' ? "menu-outline" : "menu-outline"} 
            size={22} 
            color="#fff" 
          />
        </TouchableOpacity>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#073d5c',
  },
  safeArea: {
    backgroundColor: '#073d5c',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.select({
      ios: 70,
      android: 100,
    }),
    paddingHorizontal: 20,
    backgroundColor: '#073d5c',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#044569',
      },
    }),
  },
  androidHeader: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  logoWrapper: {
    padding: 4,
    marginLeft: Platform.select({
      ios: 4,
      android: 0,
    }),
  },
  logoImage: {
    width: Platform.select({
      ios: 50,
      android: 55,
    }),
    height: Platform.select({
      ios: 50,
      android: 55,
    }),
  },
  feedbackButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.select({
      ios: 4,
      android: 0,
    }),
    ...Platform.select({
      android: {
        paddingVertical: 10,
      },
    }),
  },
});

export default Header;