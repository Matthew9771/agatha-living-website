export default function ReservationRedirect() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/properties/forest-hill-skyline#availability',
      permanent: false,
    },
  };
}
