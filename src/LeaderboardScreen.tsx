import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {ErrorBoundary} from 'react-error-boundary';

type LeaderboardItem = {
  name: string;
  rank: number;
  bananas: number;
  isSearchedUser: boolean;
  lastDayPlayed: string;
  longestStreak: any;
  stars: number;
  subscribed: boolean;
  uid: string;
};

const LeaderboardScreen: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  const searchUser = () => {
    if (userName.trim() === '') {
      Alert.alert('Error', 'Please enter a username.');
      return;
    }
    const leaderboardData: {
      [key: string]: LeaderboardItem;
    } = require('./leaderboardData.json');
    const data: LeaderboardItem[] = Object.values(leaderboardData);
    const userIndex = data.findIndex(
      item => item.name.toLowerCase() === userName.toLowerCase(),
    );
    if (userIndex !== -1) {
      const user = data[userIndex];
      const sortedData = [...data].sort((a, b) => b.bananas - a.bananas);
      const updatedLeaderboard = sortedData.slice(0, 10).map((item, index) => ({
        ...item,
        rank: index + 1,
        isSearchedUser: item.name.toLowerCase() === userName.toLowerCase(),
      }));
      if (user.bananas <= updatedLeaderboard[9].bananas) {
        const updatedUser = {
          ...user,
          rank: updatedLeaderboard.length,
          isSearchedUser: true,
        };
        updatedLeaderboard[9] = updatedUser;
      }
      setLeaderboard(updatedLeaderboard);
    } else {
      Alert.alert(
        'Error',
        'This username does not exist! Please enter an existing username.',
      );
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.row}>
        <Text style={styles.column}>Name</Text>
        <Text style={styles.column}>Rank</Text>
        <Text style={styles.column}>Bananas</Text>
        <Text style={styles.column}>Is Searched User</Text>
      </View>
    );
  };
  const renderItem = ({item}: {item: LeaderboardItem}) => {
    return (
      <View style={styles.row}>
        <Text style={styles.column}>{item.name}</Text>
        <Text style={styles.column}>{item.rank}</Text>
        <Text style={styles.column}>{item.bananas}</Text>
        <Text style={styles.column}>{item.isSearchedUser ? 'yes' : 'no'}</Text>
      </View>
    );
  };
  const ErrorFallback = () => (
    <Text style={styles.errorText}>
      An error occurred while rendering the leaderboard.
    </Text>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBox}>
        <View style={styles.inputWrapper}>
          <Image
            source={require('./assets/search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            onChangeText={text => setUserName(text)}
            value={userName}
            placeholder="Enter username"
          />
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={searchUser}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {leaderboard.length > 0 ? (
          <FlatList
            ListHeaderComponent={renderHeader} // Rendering headrs to create a
            data={leaderboard}
            keyExtractor={(_, index) => String(index)}
            renderItem={renderItem}
            extraData={true}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.errorText}>
            Enter a username to render the leaderboard
          </Text>
        )}
      </ErrorBoundary>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginHorizontal: 10,
    height: 20,
    width: 20,
  },
  buttonContainer: {
    backgroundColor: 'blue',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  column: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LeaderboardScreen;