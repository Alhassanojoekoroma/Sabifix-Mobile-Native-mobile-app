import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomTabBar() {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    const isActive = (path: string) => pathname === path || pathname.startsWith(path);

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.navBackground}>
                {/* Home */}
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Ionicons
                        name={isActive('/(tabs)') && !pathname.includes('explore') && !pathname.includes('report') ? 'home' : 'home-outline'}
                        size={24}
                        color={isActive('/(tabs)') && !pathname.includes('explore') && !pathname.includes('report') ? '#FFB800' : '#9CA3AF'}
                    />
                    <Text style={[
                        styles.tabText,
                        isActive('/(tabs)') && !pathname.includes('explore') && !pathname.includes('report') && styles.tabTextActive
                    ]}>
                        Home
                    </Text>
                </TouchableOpacity>

                {/* My Reports */}
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => router.push('/(tabs)/explore')}
                >
                    <Ionicons
                        name={isActive('/(tabs)/explore') ? 'document-text' : 'document-text-outline'}
                        size={24}
                        color={isActive('/(tabs)/explore') ? '#FFB800' : '#9CA3AF'}
                    />
                    <Text style={[
                        styles.tabText,
                        isActive('/(tabs)/explore') && styles.tabTextActive
                    ]}>
                        My Reports
                    </Text>
                </TouchableOpacity>

                {/* Spacer for floating button */}
                <View style={styles.spacer} />

                {/* Map */}
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Ionicons
                        name="map-outline"
                        size={24}
                        color="#9CA3AF"
                    />
                    <Text style={styles.tabText}>Map</Text>
                </TouchableOpacity>

                {/* Settings */}
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => router.push('/(tabs)/explore')}
                >
                    <Ionicons
                        name="settings-outline"
                        size={24}
                        color="#9CA3AF"
                    />
                    <Text style={styles.tabText}>Settings</Text>
                </TouchableOpacity>

                {/* Floating Center Button */}
                <View style={styles.floatingButtonContainer}>
                    <TouchableOpacity
                        style={styles.floatingButton}
                        onPress={() => router.push('/(tabs)/report')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="camera" size={36} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    navBackground: {
        backgroundColor: '#111827',
        height: 80,
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
        position: 'relative',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    tabText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#9CA3AF',
        marginTop: 4,
    },
    tabTextActive: {
        color: '#FFB800',
    },
    spacer: {
        flex: 1,
    },
    floatingButtonContainer: {
        position: 'absolute',
        top: -36,
        left: '50%',
        marginLeft: -36,
    },
    floatingButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#7C3AED',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 12,
        borderWidth: 6,
        borderColor: '#111827',
    },
});
