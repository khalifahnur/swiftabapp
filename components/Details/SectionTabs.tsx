import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function SectionTabs({ visibleIndex, sectionRef, topTabRef, sections }) {
  return (
    <ScrollView horizontal style={{ paddingVertical: 5 }} ref={topTabRef}>
      {["About", "Menu", "Review"].map((item, index) => {
        return (
          <Pressable
            onPress={() => {
              // Measure the layout of the section and scroll to it
              sections[index]?.current?.measureLayout(
                sectionRef.current,
                (x, y, width, height) => {
                  sectionRef.current?.scrollTo({ y, animated: true });
                },
                () => console.log('Error measuring section')
              );
              visibleIndex.value = index;
            }}
            key={index}
            style={{
              padding: 4,
              marginHorizontal: 4,
              margin: 8,
              overflow: "hidden",
              borderBottomWidth: 2,
              borderColor: item === "About" ? "green" : "black",
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                padding: 4,
                marginHorizontal: 4,
                overflow: "hidden",
                color: item === "About" ? "green" : "black",
              }}
            >
              {item}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}


const styles = StyleSheet.create({});
