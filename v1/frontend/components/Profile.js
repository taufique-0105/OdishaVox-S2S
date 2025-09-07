import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfilePage = () => {
  // Sample user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    bio: 'UX Designer & Photographer. Love hiking and exploring new places.',
    location: 'San Francisco, CA',
    joinDate: 'January 2023',
    stats: {
      posts: 124,
      followers: 2458,
      following: 342
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userBio}>{user.bio}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.userLocation}>{user.location}</Text>
        </View>
        
        <Text style={styles.joinDate}>Joined {user.joinDate}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Share Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Additional Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceItem}>
          <Ionicons name="notifications-outline" size={22} color="#333" />
          <Text style={styles.preferenceText}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
        <View style={styles.preferenceItem}>
          <Ionicons name="lock-closed-outline" size={22} color="#333" />
          <Text style={styles.preferenceText}>Privacy & Security</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.preferenceItem}>
          <Ionicons name="help-circle-outline" size={22} color="#333" />
          <Text style={styles.preferenceText}>Help Center</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
        <View style={styles.preferenceItem}>
          <Ionicons name="document-text-outline" size={22} color="#333" />
          <Text style={styles.preferenceText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 4,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  joinDate: {
    fontSize: 12,
    color: '#888',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#eaeaea',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  logoutText: {
    color: '#ff3b30',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfilePage;