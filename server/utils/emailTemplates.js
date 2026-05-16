export const orderConfirmationTemplate = (order) => {
  const orderNumber = order._id.toString().slice(-6).toUpperCase();

  const itemsHtml = order.orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            ${item.name}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            $${Number(item.price).toFixed(2)}
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 32px;">
      <div style="max-width: 640px; margin: 0 auto; background: white; border-radius: 24px; padding: 32px; border: 1px solid #e5e7eb;">
        <h1 style="margin: 0; color: #020617;">Thank you for your order!</h1>

        <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
          Your payment was successful and your order is now being processed.
        </p>

        <div style="background: #f1f5f9; border-radius: 18px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0; color: #64748b;">Order Number</p>
          <h2 style="margin: 6px 0 0; color: #020617;">#${orderNumber}</h2>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
          <thead>
            <tr>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        ${
          Number(order.discountAmount || 0) > 0
            ? `
              <div style="margin-top: 24px; color: #047857;">
                Discount: -$${Number(order.discountAmount).toFixed(2)}
              </div>
            `
            : ""
        }

        <div style="margin-top: 24px; text-align: right;">
          <p style="font-size: 20px; font-weight: bold; color: #020617;">
            Total: $${Number(order.totalPrice).toFixed(2)}
          </p>
        </div>

        <p style="margin-top: 32px; color: #64748b; font-size: 14px;">
          We’ll email you again when your order ships.
        </p>
      </div>
    </div>
  `;
};
