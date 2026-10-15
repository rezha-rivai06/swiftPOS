import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from '../icons';

interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Minuman' | 'Makanan' | 'Snack';
  color: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface KelolaPemesananProps {
  storeName?: string;
  onBack?: () => void;
}

const CATEGORIES = ['Semua', 'Minuman', 'Makanan', 'Snack'] as const;

const SAMPLE_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Kopi Susu Aren', price: 18000, category: 'Minuman', color: '#FEF3C7' },
  { id: 'p2', name: 'Americano Ice', price: 15000, category: 'Minuman', color: '#F1F5F9' },
  { id: 'p3', name: 'Matcha Latte', price: 20000, category: 'Minuman', color: '#DCFCE7' },
  { id: 'p4', name: 'Danger Drink', price: 12000, category: 'Minuman', color: '#E0E7FF' },
  { id: 'p5', name: 'Nasi Goreng Telur', price: 18000, category: 'Makanan', color: '#FFEDD5' },
  { id: 'p6', name: 'Mie Nyemek Spesial', price: 15000, category: 'Makanan', color: '#FEE2E2' },
  { id: 'p7', name: 'Roti Toast Bakar', price: 14000, category: 'Makanan', color: '#FEF9C3' },
  { id: 'p8', name: 'Ayam Geprek Pedas', price: 22000, category: 'Makanan', color: '#FCE7F3' },
  { id: 'p9', name: 'Kentang Goreng', price: 12000, category: 'Snack', color: '#FEF3C7' },
  { id: 'p10', name: 'Pisang Crispy Keju', price: 10000, category: 'Snack', color: '#F3E8FF' },
  { id: 'p11', name: 'Cireng Bumbu Rujak', price: 10000, category: 'Snack', color: '#E0F2FE' },
  { id: 'p12', name: 'Dimsum Ayam (4 pcs)', price: 15000, category: 'Snack', color: '#FFE4E6' },
];

export default function KelolaPemesanan({
  storeName = 'Kelola Toko',
  onBack,
}: KelolaPemesananProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [pilihanKategori, setPilihanKategori] = useState<string>('Semua');
  const [cart, setCart] = useState<Record<string, CartItem>>({
    p1: { id: 'p1', name: 'Kopi Susu Aren', price: 18000, qty: 1 },
    p6: { id: 'p6', name: 'Mie Nyemek Spesial', price: 15000, qty: 1 },
  });

  const kembali = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const tambahKeranjang = (product: Product) => {
    setCart((prev) => {
      const existing = prev[product.id];
      if (existing) {
        return {
          ...prev,
          [product.id]: { ...existing, qty: existing.qty + 1 },
        };
      }
      return {
        ...prev,
        [product.id]: {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
        },
      };
    });
  };

  const tambahJumlah = (id: string) => {
    setCart((prev) => {
      const item = prev[id];
      if (!item) return prev;
      return {
        ...prev,
        [id]: { ...item, qty: item.qty + 1 },
      };
    });
  };

  const kurangiJumlah = (id: string) => {
    setCart((prev) => {
      const item = prev[id];
      if (!item) return prev;
      if (item.qty <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: { ...item, qty: item.qty - 1 },
      };
    });
  };

  const daftarProduk =
    pilihanKategori === 'Semua'
      ? SAMPLE_PRODUCTS
      : SAMPLE_PRODUCTS.filter((item) => item.category === pilihanKategori);

  const isiKeranjang = Object.values(cart);
  const subtotal = isiKeranjang.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItem = isiKeranjang.reduce((acc, item) => acc + item.qty, 0);

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />

      <View role="navigation" aria-label="Navigasi Kasir" style={styles.navbar}>
        <View style={styles.navbarLeft}>
          <TouchableOpacity
            role="button"
            aria-label="Kembali ke beranda"
            style={styles.backButton}
            onPress={kembali}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text role="heading" aria-level={1} style={styles.storeTitle}>
            {storeName}
          </Text>
        </View>
        <View style={styles.navbarRight} />
      </View>

      <View role="main" style={styles.mainContainer}>
        {isTablet ? (
          <View style={styles.tabletLayout}>
            <View role="region" aria-label="Katalog Produk" style={styles.catalogColumn}>
              <Text role="heading" aria-level={2} style={styles.sectionHeading}>
                Katalog Produk
              </Text>

              <View role="tablist" aria-label="Filter Kategori" style={styles.categoryRow}>
                {CATEGORIES.map((kategori) => {
                  const aktif = pilihanKategori === kategori;
                  return (
                    <TouchableOpacity
                      key={kategori}
                      role="tab"
                      aria-selected={aktif}
                      aria-label={`Kategori ${kategori}`}
                      style={[
                        styles.categoryPill,
                        aktif && styles.categoryPillActive,
                      ]}
                      onPress={() => setPilihanKategori(kategori)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          aktif && styles.categoryTextActive,
                        ]}
                      >
                        {kategori}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productGridScroll}
              >
                <View role="list" aria-label="Daftar Produk" style={styles.productGridTablet}>
                  {daftarProduk.map((produk) => (
                    <View
                      key={produk.id}
                      role="listitem"
                      style={styles.productCardTablet}
                    >
                      <View style={[styles.productImagePlaceholder, { backgroundColor: produk.color }]}>
                        <Text style={styles.productCategoryLabel}>
                          {produk.category.toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={1}>
                          {produk.name}
                        </Text>
                        <View style={styles.priceAndActionRow}>
                          <Text style={styles.productPrice}>
                            {formatRupiah(produk.price)}
                          </Text>
                          <TouchableOpacity
                            role="button"
                            aria-label={`Tambah ${produk.name} ke keranjang`}
                            style={styles.addButton}
                            onPress={() => tambahKeranjang(produk)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.addButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View role="region" aria-label="Nota Pesanan" style={styles.receiptColumn}>
              <View style={styles.receiptCard}>
                <Text role="heading" aria-level={3} style={styles.receiptTitle}>
                  Receipt
                </Text>

                <ScrollView
                  style={styles.receiptList}
                  showsVerticalScrollIndicator={false}
                >
                  {isiKeranjang.length === 0 ? (
                    <View style={styles.emptyCartContainer}>
                      <Text style={styles.emptyCartText}>
                        Keranjang masih kosong.
                      </Text>
                      <Text style={styles.emptyCartSubtext}>
                        Pilih produk di samping untuk memulai pesanan.
                      </Text>
                    </View>
                  ) : (
                    isiKeranjang.map((item) => (
                      <View key={item.id} role="listitem" style={styles.cartRow}>
                        <View style={styles.cartRowLeft}>
                          <Text style={styles.cartItemName} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={styles.cartItemPrice}>
                            {formatRupiah(item.price)}
                          </Text>
                        </View>

                        <View style={styles.stepperContainer}>
                          <TouchableOpacity
                            role="button"
                            aria-label={`Kurangi ${item.name}`}
                            style={styles.stepperButton}
                            onPress={() => kurangiJumlah(item.id)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.stepperButtonText}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.stepperValue}>{item.qty}</Text>
                          <TouchableOpacity
                            role="button"
                            aria-label={`Tambah ${item.name}`}
                            style={styles.stepperButton}
                            onPress={() => tambahJumlah(item.id)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.stepperButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </ScrollView>

                <View style={styles.receiptSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>{formatRupiah(subtotal)}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRowTotal}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{formatRupiah(subtotal)}</Text>
                  </View>

                  <TouchableOpacity
                    role="button"
                    aria-label="Proses Pembayaran Pesanan"
                    style={[
                      styles.payButton,
                      isiKeranjang.length === 0 && styles.payButtonDisabled,
                    ]}
                    disabled={isiKeranjang.length === 0}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.payButtonText}>Proses Bayar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.mobileLayout}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.mobileScrollContent}
            >
              <Text role="heading" aria-level={2} style={styles.sectionHeading}>
                Katalog Produk
              </Text>

              <View role="tablist" aria-label="Filter Kategori" style={styles.categoryRow}>
                {CATEGORIES.map((kategori) => {
                  const aktif = pilihanKategori === kategori;
                  return (
                    <TouchableOpacity
                      key={kategori}
                      role="tab"
                      aria-selected={aktif}
                      aria-label={`Kategori ${kategori}`}
                      style={[
                        styles.categoryPill,
                        aktif && styles.categoryPillActive,
                      ]}
                      onPress={() => setPilihanKategori(kategori)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          aktif && styles.categoryTextActive,
                        ]}
                      >
                        {kategori}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View role="list" aria-label="Daftar Produk" style={styles.productGridMobile}>
                {daftarProduk.map((prod) => (
                  <View
                    key={prod.id}
                    role="listitem"
                    style={styles.productCardMobile}
                  >
                    <View style={[styles.productImagePlaceholder, { backgroundColor: prod.color }]}>
                      <Text style={styles.productCategoryLabel}>
                        {prod.category.toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {prod.name}
                      </Text>
                      <View style={styles.priceAndActionRow}>
                        <Text style={styles.productPrice}>
                          {formatRupiah(prod.price)}
                        </Text>
                        <TouchableOpacity
                          role="button"
                          aria-label={`Tambah ${prod.name} ke keranjang`}
                          style={styles.addButton}
                          onPress={() => tambahKeranjang(prod)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View role="region" aria-label="Ringkasan Keranjang Belanja" style={styles.mobileCartBar}>
              <View style={styles.mobileCartInfo}>
                <Text style={styles.mobileCartCount}>
                  {totalItem} Item
                </Text>
                <Text style={styles.mobileCartTotal}>
                  {formatRupiah(subtotal)}
                </Text>
              </View>
              <TouchableOpacity
                role="button"
                aria-label="Proses Pembayaran Pesanan Mobile"
                style={[
                  styles.mobilePayButton,
                  isiKeranjang.length === 0 && styles.payButtonDisabled,
                ]}
                disabled={isiKeranjang.length === 0}
                activeOpacity={0.8}
              >
                <Text style={styles.mobilePayButtonText}>Bayar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F766E',
  },
  navbar: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  navbarRight: {
    width: 36,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    marginTop: -10,
  },
  tabletLayout: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    gap: 20,
  },
  catalogColumn: {
    flex: 1.3,
  },
  receiptColumn: {
    flex: 0.7,
    maxWidth: 380,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  productGridScroll: {
    paddingBottom: 24,
  },
  productGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  productCardTablet: {
    width: '23.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 96,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  productCategoryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  productInfo: {
    gap: 4,
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  priceAndActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  receiptCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-between',
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  receiptList: {
    flex: 1,
  },
  emptyCartContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  emptyCartSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cartRowLeft: {
    flex: 1,
    marginRight: 10,
  },
  cartItemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  cartItemPrice: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  stepperButton: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F766E',
  },
  stepperValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    minWidth: 14,
    textAlign: 'center',
  },
  receiptSummary: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 2,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F766E',
  },
  payButton: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  mobileLayout: {
    flex: 1,
  },
  mobileScrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  productGridMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  productCardMobile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mobileCartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 6,
  },
  mobileCartInfo: {
    gap: 2,
  },
  mobileCartCount: {
    fontSize: 11,
    color: '#64748B',
  },
  mobileCartTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F766E',
  },
  mobilePayButton: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  mobilePayButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
