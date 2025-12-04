import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { categorizeIssue, type CategorySuggestion } from '../../lib/ai-categorization';
import { detectDuplicates, shouldWarnDuplicate, type DuplicateMatch } from '../../lib/duplicate-detector';

export default function ReportScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Roads');
    const [image, setImage] = useState<string | null>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<CategorySuggestion | null>(null);
    const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
    const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    // AI Categorization when description changes
    useEffect(() => {
        if (description.length > 10) {
            const runCategorization = async () => {
                const suggestion = await categorizeIssue(image, description);
                setAiSuggestion(suggestion);
            };
            runCategorization();
        }
    }, [description, image]);

    // Duplicate detection when we have enough info
    useEffect(() => {
        if (description.length > 10 && location) {
            checkForDuplicates();
        }
    }, [description, category, location]);

    const checkForDuplicates = async () => {
        if (!location) return;

        try {
            // Fetch existing issues
            const { data: existingIssues, error } = await supabase
                .from('issues')
                .select('id, title, description, category, latitude, longitude, status')
                .neq('status', 'Resolved');

            if (error) throw error;

            const matches = await detectDuplicates(
                {
                    title,
                    description,
                    category,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },
                existingIssues || []
            );

            setDuplicates(matches);
            setShowDuplicateWarning(shouldWarnDuplicate(matches));
        } catch (error) {
            console.error('Duplicate detection error:', error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        if (!image) return null;
        return image; // Placeholder: storing local URI
    };

    const submitReport = async () => {
        if (!title || !description || !category) {
            Alert.alert('Please fill in all fields');
            return;
        }

        // Show duplicate warning if needed
        if (showDuplicateWarning && duplicates.length > 0) {
            Alert.alert(
                'Possible Duplicate',
                `A similar issue was reported ${duplicates[0].reason}. Do you still want to submit?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Submit Anyway', onPress: () => performSubmit() },
                ]
            );
            return;
        }

        await performSubmit();
    };

    const performSubmit = async () => {
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user logged in');

            const imageUrl = await uploadImage();

            const { error } = await supabase
                .from('issues')
                .insert({
                    title,
                    description,
                    category,
                    image_url: imageUrl,
                    latitude: location?.coords.latitude,
                    longitude: location?.coords.longitude,
                    reporter_id: user.id,
                    status: 'Reported'
                });

            if (error) throw error;

            Alert.alert('Success', 'Issue reported successfully!');
            router.push('/(tabs)');

            // Reset form
            setTitle('');
            setDescription('');
            setImage(null);
            setAiSuggestion(null);
            setDuplicates([]);
            setShowDuplicateWarning(false);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Report an Issue</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Large Pothole"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe the issue..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />
            </View>

            {/* AI Suggestion Banner */}
            {aiSuggestion && aiSuggestion.confidence > 0.7 && (
                <View style={styles.aiSuggestionBanner}>
                    <View style={styles.aiSuggestionHeader}>
                        <Ionicons name="sparkles" size={16} color="#312EFF" />
                        <Text style={styles.aiSuggestionTitle}>AI Suggestion</Text>
                    </View>
                    <Text style={styles.aiSuggestionText}>
                        Category: <Text style={styles.aiSuggestionBold}>{aiSuggestion.category}</Text>
                        {aiSuggestion.severity && ` • Severity: ${aiSuggestion.severity}`}
                    </Text>
                    {aiSuggestion.category !== category && (
                        <TouchableOpacity
                            style={styles.aiSuggestionButton}
                            onPress={() => setCategory(aiSuggestion.category)}
                        >
                            <Text style={styles.aiSuggestionButtonText}>Apply Suggestion</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Duplicate Warning */}
            {showDuplicateWarning && duplicates.length > 0 && (
                <View style={styles.duplicateWarning}>
                    <View style={styles.duplicateWarningHeader}>
                        <Ionicons name="warning" size={16} color="#F59E0B" />
                        <Text style={styles.duplicateWarningTitle}>Possible Duplicate</Text>
                    </View>
                    <Text style={styles.duplicateWarningText}>
                        {duplicates[0].reason}
                    </Text>
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryContainer}>
                    {['Roads', 'Water', 'Electricity', 'Garbage'].map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text style={[styles.categoryText, category === cat && styles.categoryTextSelected]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Photo</Text>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="camera" size={32} color="#6B7280" />
                            <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Location</Text>
                <View style={styles.locationContainer}>
                    <Ionicons name="location" size={20} color="#312EFF" />
                    <Text style={styles.locationText}>
                        {location ? 'Location detected' : 'Fetching location...'}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={submitReport}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7F9',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#312EFF',
        marginBottom: 24,
        marginTop: 40,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    categoryChipSelected: {
        backgroundColor: '#312EFF',
        borderColor: '#312EFF',
    },
    categoryText: {
        color: '#374151',
        fontWeight: '500',
    },
    categoryTextSelected: {
        color: 'white',
    },
    imageButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        width: '100%',
        height: 150,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
    },
    imagePlaceholderText: {
        marginTop: 8,
        color: '#6B7280',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    locationText: {
        marginLeft: 8,
        color: '#374151',
    },
    submitButton: {
        backgroundColor: '#312EFF',
        padding: 16,
        borderRadius: 9999,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        shadowColor: '#312EFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    aiSuggestionBanner: {
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    aiSuggestionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    aiSuggestionTitle: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#312EFF',
    },
    aiSuggestionText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 8,
    },
    aiSuggestionBold: {
        fontWeight: '600',
        color: '#312EFF',
    },
    aiSuggestionButton: {
        backgroundColor: '#312EFF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    aiSuggestionButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    duplicateWarning: {
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FCD34D',
    },
    duplicateWarningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    duplicateWarningTitle: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#F59E0B',
    },
    duplicateWarningText: {
        fontSize: 14,
        color: '#92400E',
    },
});
