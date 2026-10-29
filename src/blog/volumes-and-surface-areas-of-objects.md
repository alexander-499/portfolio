---
title: "Exploring the Volumes and Surface Areas of 3D Objects"
description: ""
published: "2026-06-26"
updated: "2026-10-26"
category: "math"
draft: true
---

Math is tuff.

## Cuboids

Cuboids are pretty simple. We just multiply each dimension to get the volume. The surface area can be calculated by "counting" all faces of the cuboid.

$$V = lwh$$
$$A = 2(lw + wh + hl)$$

If the cuboid is a cube the formulas get even simpler.

$$V = a^3$$
$$A = 2(a^2 + a^2 + a^2) = 6a^2$$

In case only the space diagonal of a cube is known we can solve using the Pythagorean theorem.

$$
\begin{aligned}
a^2 + a^2 + a^2 = d^2 \\
3a^2 = d^2 \\
\sqrt{3a^2} = \sqrt{d^2} \\
\sqrt{3}a = d \\
a = \frac{d}{\sqrt{3}}
\end{aligned}
$$

$$V = \frac{d}{\sqrt{3}}^2 = \frac{d^2}{3}$$
$$A = 6\frac{d}{\sqrt{3}}^2 = 6\frac{d^2}{3} = 2d^2$$

## Prisms

Prisms are shapes with a polygon base area and a height. We multiply both to get the volume. The surface area is slightly more complicated since the lateral surface depends on the base area perimeter.

$$V = Bh$$
$$A = 2B + Ph$$

The formula for a triangular prism, for example, would look like this.

$$V = \frac{1}{2}a_Bh_B h$$
$$A = a_Bh_B + (a_Bb_Bc_B)h$$

And the rectangular prism is the same as a cuboid, so the formula is the same.

## Pyramids