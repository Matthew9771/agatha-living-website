export default function CheckoutRedirect() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/properties/greystead-road#availability',
      permanent: false,
    },
  };
}
