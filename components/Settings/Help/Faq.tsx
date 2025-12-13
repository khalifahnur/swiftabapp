import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function Faq() {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const faqs = [
    { question: 'How do I make a reservation using the app?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { question: 'Can I cancel my reservation through the app?', answer: 'Yes, you can cancel your reservation under the "Reservations Tab" section.' },
    { question: 'How do I view or track my reservation history?', answer: 'Your reservation history is available under the "My Reservations" tab in the app.' },
    { question: 'Is the app available in multiple languages?', answer: 'Currently, the app supports English and Swahili, with more languages coming soon.' },
    { question: 'Can I contact the restaurant directly in app?', answer: 'Yes, you can contact the restaurant directly through the "Contact Us" section.' },
    { question: 'How do I provide feedback to the restaurant?', answer: 'Feedback can be submitted under the "Feedback" section in the app.' },
    { question: 'How do I add a favorite restaurant to my wishlist?', answer: 'You can add a restaurant to your wishlist by clicking the heart icon on the restaurant’s profile.' },
  ];

  const renderFAQ = (faq, index) => (
    <TouchableOpacity key={index} onPress={() => setExpandedQuestion(expandedQuestion === index ? null : index)}>
      <View style={styles.faqItem}>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        {expandedQuestion === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {faqs.map((faq, index) => renderFAQ(faq, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  faqItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqAnswer: {
    marginTop: 5,
    fontSize: 14,
  },
});

