import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
//import { FlashList } from "@shopify/flash-list";
import { color } from "@/constants/Colors";
import { FetchOrder } from "@/types";
import Header from "../Header";
import OrderDetailFooter from "./OrderDetailFooter";
import OrderDetailHeader from "./OrderDetailHeader";
import RenderMenu from "./RenderMenu";
import RenderMenuItem from "./RenderMenuItem";

interface Props {
  data: FetchOrder[];
  refreshing: boolean;
  onRefresh: () => void;
}

const Orders = ({ data, refreshing, onRefresh }: Props) => {
  const [selectedOrder, setSelectedOrder] = useState<FetchOrder | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);

  const renderData = data?.orders;
  return (
    <>
      {!isViewingDetails ? (
        <FlatList
          data={renderData}
          renderItem={({ item }) => (
            <RenderMenu
              item={item}
              setSelectedOrder={setSelectedOrder}
              setIsViewingDetails={setIsViewingDetails}
            />
          )}
          //estimatedItemSize={150}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={<Header HeaderTitle={"Order History"} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[color.green]}
            />
          }
        />
      ) : (
        <FlatList
          data={selectedOrder ? [selectedOrder] : []}
          renderItem={({ item }) => <RenderMenuItem items={item.menu} />}
          //estimatedItemSize={150}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <OrderDetailHeader
              setIsViewingDetails={setIsViewingDetails}
              selectedOrder={selectedOrder}
            />
          )}
          ListFooterComponent={() => (
            <OrderDetailFooter selectedOrder={selectedOrder} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[color.green]}
            />
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Orders;
