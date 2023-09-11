export default function AffirmationBadges({
  checkIn,
  selectedItem,
  visibility,
}: {
  checkIn: boolean;
  selectedItem: { image: string; gif_image: string };
  visibility: any;
}) {
  return (
    <div style={{ visibility }}>
      <img
        src={checkIn ? selectedItem?.image : selectedItem?.gif_image} //technically gif_image
        style={{
          minWidth: 100,
          width: 100,
          maxWidth: 120,
          objectFit: "fill",
        }}
      />
    </div>
  );
}
