import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';

interface IssueMapProps {
    issues: any[];
    userLocation: any;
}

export default function IssueMap({ issues, userLocation }: IssueMapProps) {
    const router = useRouter();

    const initialRegion = {
        latitude: userLocation?.coords.latitude || 8.4657, // Default to Freetown
        longitude: userLocation?.coords.longitude || -13.2317,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
        <MapView style={styles.map} initialRegion={initialRegion} showsUserLocation>
            {issues.map((issue) => (
                <Marker
                    key={issue.id}
                    coordinate={{
                        latitude: issue.latitude || 0,
                        longitude: issue.longitude || 0,
                    }}
                    pinColor={issue.status === 'Resolved' ? 'green' : 'red'}
                >
                    <Callout onPress={() => router.push(`/issue/${issue.id}`)}>
                        <View style={styles.callout}>
                            <Text style={styles.title}>{issue.title}</Text>
                            <Text style={styles.category}>{issue.category}</Text>
                            <Text style={styles.status}>{issue.status}</Text>
                        </View>
                    </Callout>
                </Marker>
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
    callout: {
        width: 150,
        padding: 4,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 2,
    },
    category: {
        fontSize: 12,
        color: '#666',
    },
    status: {
        fontSize: 10,
        color: '#312EFF',
        marginTop: 2,
    },
});
