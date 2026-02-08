import React from "react";
import { View, Text } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

// --------------------
// Extract Video ID 
// --------------------
const getYoutubeVideoId = (url = "") => {
  if (!url) return null;

  if (url.includes("/shorts/")) {
    return url.split("/shorts/")[1]?.split("?")[0];
  }

  if (url.includes("watch?v=")) {
    return url.split("watch?v=")[1]?.split("&")[0];
  }

  return null;
};

// --------------------
// Block Navigation 
// --------------------
const blockYoutubeNavigation = (request) => {
  const url = request?.url || "";
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return false;
  }
  return true;
};

// --------------------
// MAIN MEDIA SECTION
// --> Matches your screenshot UI
// --------------------
const MediaSection = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <View style={{ width: "100%", marginTop: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
        Media Contents :
      </Text>

      {data.map((item, index) => {
        const videoId = getYoutubeVideoId(item.media_url);
        if (!videoId) return null;

        return (
          <View
            key={index}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingBottom: 12,
              marginBottom: 16,
              overflow: "hidden",
              elevation: 3,      // Android shadow
              shadowColor: "#000", // iOS shadow
              shadowOpacity: 0.15,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            {/* VIDEO PLAYER */}
            <YoutubePlayer
              height={210}
              play={false}
              videoId={videoId}
              webViewProps={{
                allowsInlineMediaPlayback: true,
                mediaPlaybackRequiresUserAction: false,
                originWhitelist: ["*"],
                onShouldStartLoadWithRequest: blockYoutubeNavigation,
              }}
            />

            {/* TITLE */}
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                paddingHorizontal: 12,
                marginTop: 8,
              }}
            >
              {item.name}
            </Text>

            {/* DESCRIPTION */}
            {item.description ? (
              <Text
                style={{
                  fontSize: 13,
                  color: "#666",
                  paddingHorizontal: 12,
                  marginTop: 4,
                }}
              >
                {item.description}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

export default MediaSection;
