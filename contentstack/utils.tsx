export const ContentstackImageComponent = ({ imageConnection, className }: any) => {
  const imageDetails = imageConnection?.edges?.[0]?.node;

  if (imageDetails) {
    return (
      <img
        alt={imageDetails.description || imageDetails.title || ''}
        src={imageDetails.url}
        // height={imageDetails.dimension.height}
        // width={imageDetails.dimension.width}
        className={className}
      />
    );
  }

  return null;
};
