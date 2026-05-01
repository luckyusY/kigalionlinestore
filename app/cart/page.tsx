"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";

function checkoutMessage(items: ReturnType<typeof useCart>["items"]) {
  const lines = items.map((item, index) =>
    `${index + 1}. ${item.name} x${item.quantity} - ${item.priceDisplay}`
  );
  return encodeURIComponent(`Hi! I want to order these items:\n\n${lines.join("\n")}\n\nPlease confirm availability and delivery.`);
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  const checkoutUrl = `https://wa.me/250784734956?text=${checkoutMessage(items)}`;

  return (
    <div className="cart-page">
      <div className="cart-shell">
        <div className="cart-heading">
          <div>
            <h1>Your cart</h1>
            <p>{items.length ? `${items.length} product${items.length === 1 ? "" : "s"} ready for WhatsApp checkout` : "Your cart is empty"}</p>
          </div>
          <Link href="/products">Continue shopping</Link>
        </div>

        {items.length === 0 ? (
          <section className="cart-empty">
            <h2>No items yet</h2>
            <p>Add products to cart, then submit the whole order to WhatsApp.</p>
            <Link href="/products">Browse products</Link>
          </section>
        ) : (
          <section className="cart-grid">
            <div className="cart-items">
              {items.map((item) => (
                <article key={item.slug} className="cart-item">
                  <div className="cart-item-image">
                    <Image src={item.image} alt={item.name} fill sizes="90px" unoptimized />
                  </div>
                  <div>
                    <Link href={`/products/${item.slug}`}>{item.name}</Link>
                    <span>{item.priceDisplay}</span>
                    <div className="cart-qty">
                      <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)}><Minus size={14} /></button>
                      <strong>{item.quantity}</strong>
                      <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                  <button type="button" className="cart-remove" onClick={() => removeItem(item.slug)} aria-label={`Remove ${item.name}`}>
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Order summary</h2>
              <div>
                <span>Estimated total</span>
                <strong>{total ? `${total.toLocaleString("en-US")} RWF` : "Confirm price"}</strong>
              </div>
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" onClick={clearCart}>
                <MessageCircle size={18} />
                Submit order on WhatsApp
              </a>
              <button type="button" onClick={clearCart}>Clear cart</button>
            </aside>
          </section>
        )}
      </div>
    </div>
  );
}
