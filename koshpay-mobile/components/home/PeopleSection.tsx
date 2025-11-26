import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Theme, Person } from '../../types';
import { Avatar } from '../common/Avatar';

interface PeopleSectionProps {
  people: Person[];
  theme: Theme;
}

export const PeopleSection: React.FC<PeopleSectionProps> = ({ people, theme }) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.text }]}>People</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {people.map((person) => (
          <TouchableOpacity key={person.id} style={styles.item}>
            <Avatar
              initials={person.initials}
              bgColor={person.isMore ? theme.card : person.bgColor}
              textColor={person.textColor}
              hasNotification={person.hasNotification}
              isMore={person.isMore}
            />
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {person.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 16,
    gap: 20,
  },
  item: {
    alignItems: 'center',
    width: 70,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});