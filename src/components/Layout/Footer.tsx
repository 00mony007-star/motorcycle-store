import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const [email, setEmail] = React.useState('')
  const { t } = useTranslation()

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl">MotoGear</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.newsletterPrompt')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>1-800-MOTOGEAR</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>support@motogear.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>123 Rider Ave, Motorcycle City, MC 12345</span>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.shop')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/helmets" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.helmets')}</Link></li>
              <li><Link to="/category/jackets" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.jackets')}</Link></li>
              <li><Link to="/category/gloves" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.gloves')}</Link></li>
              <li><Link to="/category/boots" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.boots')}</Link></li>
              <li><Link to="/category/accessories" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.accessories')}</Link></li>
              <li><Link to="/offers" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.offers')}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.customerService')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.contactUs')}</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.shippingInfo')}</Link></li>
              <li><Link to="/returns" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.returns')}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.stayConnected')}</h3>
            <p className="text-sm text-muted-foreground">{t('footer.newsletterPrompt')}</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Button type="submit" className="w-full">{t('footer.subscribe')}</Button>
            </form>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" aria-label="Facebook"><Facebook className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" aria-label="Twitter"><Twitter className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" aria-label="Instagram"><Instagram className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" aria-label="YouTube"><Youtube className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">{t('footer.copyright')}</p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.privacyPolicy')}</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer.termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
