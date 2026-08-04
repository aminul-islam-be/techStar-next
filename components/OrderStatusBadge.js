export default function OrderStatusBadge({ status }) {
  const styles = {
    pending: { background: '#ffc107', color: '#212529' },
    processing: { background: '#17a2b8', color: 'white' },
    shipped: { background: '#007bff', color: 'white' },
    delivered: { background: '#28a745', color: 'white' },
    cancelled: { background: '#dc3545', color: 'white' },
  };

  const labels = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  const style = styles[status] || styles.pending;

  return (
    <span className="badge" style={style}>
      {labels[status] || status}
      <style jsx>{`
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }
      `}</style>
    </span>
  );
}
