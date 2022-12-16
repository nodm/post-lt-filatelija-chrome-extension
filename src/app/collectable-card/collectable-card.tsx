import { CollectionRecord } from '../models/philately';
import styles from './collectable-card.module.scss';

export interface CollectableCartProps {
  data: CollectionRecord
}

export const CollectableCard = ({ data }: CollectableCartProps) => {
  if (!data) return null;

  return (
    <div className={styles.collectableCard}>
      {data?.imageUrl && <img src={data.imageUrl} alt={data?.title} />}
      <pre>
          {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default CollectableCard;
