-- Auto Style — "Almost sold out" marketing flag.
-- Purely a merchant-controlled marketing badge, independent of the real
-- stock count (stock stays the authoritative number `place_order` checks
-- against; this column never gates checkout or gets read by any RPC).
ALTER TABLE products ADD COLUMN almost_sold_out boolean NOT NULL DEFAULT false;
