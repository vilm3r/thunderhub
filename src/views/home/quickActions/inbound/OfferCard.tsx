import * as React from 'react';
import { useGetBaseUrisQuery } from 'src/graphql/queries/__generated__/getBaseUris.generated';
import { BaseOfferType } from 'src/graphql/types';

type OfferProps = {
  offer: BaseOfferType;
};

export const OfferCard = ({ offer }: OfferProps) => {
  const { data, loading } = useGetBaseUrisQuery();

  console.log({ offer, data, loading });

  return <div>Hello</div>;
};
